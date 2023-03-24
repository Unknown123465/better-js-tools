class Schedule {
    constructor() {
        this.scheduleArray = [];
    }
    addSchedule(name, fun, time, ...params) {
        if (typeof name === "string" && this.scheduleArray.some((f) => f.name === name)) {
            throw new TypeError("This schedule name already exists: " + name);
        }
        else if (typeof time === "number" && (!isFinite(time) || time < 0)) {
            throw new RangeError("The time argument must be a finite and positive.");
        }
        this.scheduleArray.push({ name: name || undefined, fun, time: time ?? 0, params });
    }
    addScheduleByFirst(name, fun, time, ...params) {
        if (typeof name === "string" && this.scheduleArray.some((f) => f.name === name)) {
            throw new TypeError("This schedule name already exists: " + name);
        }
        else if (typeof time === "number" && (!isFinite(time) || time < 0)) {
            throw new RangeError("The time argument must be a finite and positive.");
        }
        this.scheduleArray.unshift({ name: name || undefined, fun, time: time ?? 0, params });
    }
    addScheduleByIndex(index, name, fun, time, ...params) {
        if (index < 0 || !isFinite(index) || !Number.isInteger(index)) {
            throw new RangeError("The index argument must be at least 0, a finite, and an integer.");
        }
        else if (typeof name === "string" && this.scheduleArray.some((f) => f.name === name)) {
            throw new TypeError("This schedule name already exists: " + name);
        }
        else if (typeof time === "number" && (!isFinite(time) || time < 0)) {
            throw new RangeError("The time argument must be a finite and positive.");
        }
        this.scheduleArray.splice(index, 0, { name: name || undefined, fun, time: time ?? 0, params });
    }
    getSchedule(target) {
        if (typeof target === "number") {
            return this.scheduleArray[target];
        }
        else {
            return this.scheduleArray.find((f) => f.name === target);
        }
    }
    getScheduleRangeOrNames(...range) {
        const typeArray = ["string", "number", "undefined"];
        const errorIndex = range.findIndex((f) => !typeArray.includes(typeof f));
        if (!range.length) {
            throw new TypeError("Failed to execute 'getScheduleRangeOrNames' on 'Schedule': 1 argument required, but only 0 present.");
        }
        else if (range.some((f, index, cb) => cb.some((f2) => typeof f2 !== typeof f))) {
            throw new TypeError(`The arguments types don't match.`);
        }
        else if (errorIndex > -1) {
            throw new TypeError(`The type of argument ${errorIndex + 1} is invalid. Valid types are ${typeArray.join(", ")}.`);
        }
        else if (range.some((f) => typeof f === "number" && (!Number.isInteger(f) || !isFinite(f)))) {
            throw new RangeError("The argument must be integer and finite.");
        }
        else if (range.some((f) => typeof f === "number" && f < 0)) {
            throw new RangeError("The arguments must be zero or greater.");
        }
        else if (typeof range[0] === "number" && typeof range[1] === "number" && range[0] > range[1]) {
            throw new RangeError("The first argument must not be larger than the second argument.");
        }
        return this.scheduleArray.filter((f, index, cb) => range.some((f2) => f.name === f2) || (typeof range[0] === "number" && range[0] <= index && (typeof range[1] === "number" ? range[1] : cb.length) > index));
    }
    getScheduleAll() {
        return this.scheduleArray;
    }
    setSchedule(target, fun) {
        let changeTarget = typeof target === "number" ? this.scheduleArray[target] : this.scheduleArray.find((f) => f.name === target);
        if (typeof changeTarget === "undefined") {
            throw new TypeError("The schedule does not exist.");
        }
        else if (typeof fun === "string") {
            changeTarget.name = fun;
        }
        else if (typeof fun === "number") {
            changeTarget.time = fun;
        }
        else if (Array.isArray(fun)) {
            changeTarget.params = fun;
        }
        else {
            changeTarget = fun;
        }
        this.scheduleArray = this.scheduleArray.map((f, index) => index === target || f.name === target ? changeTarget ?? f : f);
        return true;
    }
    deleteSchedule(target) {
        if (this.scheduleArray.some((f, index) => index === target || f.name === target)) {
            this.scheduleArray = this.scheduleArray.filter((f, index) => !(index === target || f.name === target));
            return true;
        }
        else {
            return false;
        }
    }
    clearSchedule() {
        this.scheduleArray = [];
    }
    async runScheduleOnePromise(target, time = 0, ...params) {
        const schedule = typeof target === "number" ? this.scheduleArray[target] : this.scheduleArray.find((f) => f.name === target);
        if (!schedule) {
            throw new TypeError("The schedule does not exist.");
        }
        return await new Promise((resolve) => {
            setTimeout(async () => {
                const result = await schedule.fun(...(params.length ? params : schedule.params));
                resolve(result);
            }, schedule.time ?? time ?? 0);
        });
    }
    runScheduleOne(target, ...params) {
        const schedule = typeof target === "number" ? this.scheduleArray[target] : this.scheduleArray.find((f) => f.name === target);
        if (!schedule) {
            throw new TypeError("The schedule does not exist.");
        }
        return schedule.fun(...(params.length ? params : schedule.params));
    }
    async runScheduleAllPromise(time = [], ...params) {
        let index = 0;
        const array = [];
        for (const i of this.scheduleArray) {
            const result = await new Promise((resolve) => {
                setTimeout(async () => {
                    const result = await i.fun(...(params[index]?.length ? params[index] : i.params));
                    resolve(result);
                }, time[index] ?? i.time ?? 0);
            });
            array.push(result);
            index++;
        }
        return array;
    }
    runScheduleAll(...params) {
        const array = [];
        this.scheduleArray.forEach((f, index) => {
            const result = f.fun(...(params[index]?.length ? params[index] : f.params));
            array.push(result);
        });
        return array;
    }
    async runScheduleRangePromise(start = 0, end = this.scheduleArray.length - 1, time = [], ...params) {
        if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < 0) {
            throw new RangeError("The start and end arguments must be greater than or equal to 0 and must be integer(but the end argument can be undefined).");
        }
        else if (!isFinite(start) || !isFinite(end)) {
            throw new RangeError("The start and end arguments must be a finite(but the end argument can be undefined).");
        }
        else if (start > end) {
            throw new RangeError("The start argument must not be larger than the end argument.");
        }
        let index = 0;
        let paramIndex = 0;
        const array = [];
        for (const i of this.scheduleArray) {
            if (start > index) {
                index++;
                continue;
            }
            else if (end <= index) {
                break;
            }
            const result = await new Promise((resolve) => {
                setTimeout(async () => {
                    const result = await i.fun(...(params[paramIndex]?.length ? params[paramIndex] : i.params));
                    resolve(result);
                }, time[paramIndex] ?? i.time ?? 0);
            });
            array.push(result);
            index++;
            paramIndex++;
        }
        return array;
    }
    runScheduleRange(start = 0, end = this.scheduleArray.length - 1, ...params) {
        if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < 0) {
            throw new RangeError("The start and end arguments must be greater than or equal to 0 and must be integer(but the end argument can be undefined).");
        }
        else if (!isFinite(start) || !isFinite(end)) {
            throw new RangeError("The start and end arguments must be a finite(but the end argument can be undefined).");
        }
        else if (start > end) {
            throw new RangeError("The start argument must not be larger than the end argument.");
        }
        let index = 0;
        let paramIndex = 0;
        const array = [];
        for (const i of this.scheduleArray) {
            if (start > index) {
                index++;
                continue;
            }
            else if (end <= index) {
                break;
            }
            const result = i.fun(...(params[paramIndex]?.length ? params[paramIndex] : i.params));
            array.push(result);
            index++;
            paramIndex++;
        }
        return array;
    }
    async runScheduleAsNamesPromise(name, time, ...params) {
        if (Array.isArray(name) && !name.length) {
            throw new TypeError("The array length of the name argument must be at least 1.");
        }
        let index = 0;
        const array = [];
        for (const i of this.scheduleArray) {
            if (typeof i.name === "undefined" || (typeof i.name === "string" && Array.isArray(name) && !name.includes(i.name)) || (name instanceof RegExp && i.name.search(name) === -1)) {
                continue;
            }
            const result = await new Promise((resolve) => {
                setTimeout(async () => {
                    const result = await i.fun(...(params[index]?.length ? params[index] : i.params));
                    resolve(result);
                }, time[index] ?? i.time ?? 0);
            });
            array.push(result);
            index++;
        }
        return array;
    }
    runScheduleAsNames(name, ...params) {
        if (Array.isArray(name) && !name.length) {
            throw new TypeError("The array length of the name argument must be at least 1.");
        }
        let index = 0;
        const array = [];
        for (const i of this.scheduleArray) {
            if (typeof i.name === "undefined" || (typeof i.name === "string" && Array.isArray(name) && !name.includes(i.name)) || (name instanceof RegExp && i.name.search(name) === -1)) {
                continue;
            }
            const result = i.fun(...(params[index]?.length ? params[index] : i.params));
            array.push(result);
            index++;
        }
        return array;
    }
    async runScheduleExceptNamesPromise(name, time, ...params) {
        if (Array.isArray(name) && !name.length) {
            throw new TypeError("The array length of the name argument must be at least 1.");
        }
        let index = 0;
        const array = [];
        for (const i of this.scheduleArray) {
            if (typeof i.name === "undefined" || (typeof i.name === "string" && Array.isArray(name) && name.includes(i.name)) || (name instanceof RegExp && i.name.search(name) > -1)) {
                continue;
            }
            const result = await new Promise((resolve) => {
                setTimeout(async () => {
                    const result = await i.fun(...(params[index]?.length ? params[index] : i.params));
                    resolve(result);
                }, time[index] ?? i.time ?? 0);
            });
            array.push(result);
            index++;
        }
        return array;
    }
    runScheduleExceptNames(name, ...params) {
        if (Array.isArray(name) && !name.length) {
            throw new TypeError("The array length of the name argument must be at least 1.");
        }
        let index = 0;
        const array = [];
        for (const i of this.scheduleArray) {
            if (typeof i.name === "undefined" || (typeof i.name === "string" && Array.isArray(name) && name.includes(i.name)) || (name instanceof RegExp && i.name.search(name) > -1)) {
                continue;
            }
            const result = i.fun(...(params[index]?.length ? params[index] : i.params));
            array.push(result);
            index++;
        }
        return array;
    }
    static async sleep(time) {
        if (time < 0 || !isFinite(time)) {
            throw new RangeError("The argument must be positive and finite");
        }
        await new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }
}
export default Schedule;
