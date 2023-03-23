var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Schedule {
    constructor() {
        this.scheduleArray = [];
    }
    addSchedule(name, fun, time, ...params) {
        if (this.scheduleArray.some((f) => f.name === name)) {
            throw new TypeError("That schedule name already exists: " + name);
        }
        this.scheduleArray.push({ name: name !== null && name !== void 0 ? name : undefined, fun, time, params: [...params] });
    }
    getSchedule(target) {
        if (typeof target === "number") {
            return this.scheduleArray[target];
        }
        else {
            return this.scheduleArray.find((f) => f.name === target);
        }
    }
    getScheduleRange(...range) {
        const typeArray = ["string", "number", "undefined"];
        const errorIndex = range.findIndex((f) => !typeArray.includes(typeof f));
        if (!range.length) {
            throw new TypeError("Failed to execute 'getScheduleRange' on 'Schedule': 1 argument required, but only 0 present.");
        }
        else if (range.some((f, index, cb) => cb.some((f2) => typeof f2 !== typeof f))) {
            throw new TypeError(`The arguments types don't match.`);
        }
        else if (errorIndex > -1) {
            throw new TypeError(`The type of argument ${errorIndex + 1} is invalid. Valid types are ${typeArray.toString().replace(/,/g, ", ")}.`);
        }
        return this.scheduleArray.filter((f, index, cb) => range.some((f2) => f.name === f2) || (typeof range[0] === "number" && range[0] <= index && (typeof range[1] === "number" ? range[1] : cb.length) > index));
    }
    getScheduleAll() {
        return this.scheduleArray;
    }
    setSchedule(target, fun) {
        let changeTarget = typeof target === "number" ? this.scheduleArray[target] : this.scheduleArray.find((f) => f.name);
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
        this.scheduleArray = this.scheduleArray.map((f, index) => index === target || f.name === target ? changeTarget !== null && changeTarget !== void 0 ? changeTarget : f : f);
    }
    deleteSchedule(target) {
        this.scheduleArray = this.scheduleArray.filter((f, index) => !(index === target || f.name === target));
    }
    clearSchedule() {
        this.scheduleArray = [];
    }
    runScheduleOnePromise(target, time = 0, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            const schedule = typeof target === "number" ? this.scheduleArray[target] : this.scheduleArray.find((f) => f.name);
            if (!schedule) {
                throw new TypeError("The schedule does not exist.");
            }
            return yield new Promise((resolve) => {
                var _a, _b;
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    const result = yield schedule.fun(...(params.length ? params : schedule.params));
                    resolve(result);
                }), (_b = (_a = schedule.time) !== null && _a !== void 0 ? _a : time) !== null && _b !== void 0 ? _b : 0);
            });
        });
    }
    runScheduleOne(target, ...params) {
        const schedule = typeof target === "number" ? this.scheduleArray[target] : this.scheduleArray.find((f) => f.name);
        if (!schedule) {
            throw new TypeError("The schedule does not exist.");
        }
        return schedule.fun(...(params.length ? params : schedule.params));
    }
    runScheduleAllPromise(time = [], ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            const array = [];
            for (const i of this.scheduleArray) {
                const result = yield new Promise((resolve) => {
                    var _a, _b;
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        var _c;
                        const result = yield i.fun(...(((_c = params[index]) === null || _c === void 0 ? void 0 : _c.length) ? params[index] : i.params));
                        resolve(result);
                    }), (_b = (_a = time[index]) !== null && _a !== void 0 ? _a : i.time) !== null && _b !== void 0 ? _b : 0);
                });
                array.push(result);
                index++;
            }
            return array;
        });
    }
    runScheduleAll(...params) {
        const array = [];
        this.scheduleArray.forEach((f, index) => {
            var _a;
            const result = f.fun(...(((_a = params[index]) === null || _a === void 0 ? void 0 : _a.length) ? params[index] : f.params));
            array.push(result);
        });
        return array;
    }
    runScheduleRangePromise(start = 0, end = this.scheduleArray.length - 1, time = [], ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            const array = [];
            for (const i of this.scheduleArray) {
                if (start > index) {
                    index++;
                    continue;
                }
                else if (end <= index) {
                    break;
                }
                const result = yield new Promise((resolve) => {
                    var _a, _b;
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        var _c;
                        const result = yield i.fun(...(((_c = params[index]) === null || _c === void 0 ? void 0 : _c.length) ? params[index] : i.params));
                        resolve(result);
                    }), (_b = (_a = time[index]) !== null && _a !== void 0 ? _a : i.time) !== null && _b !== void 0 ? _b : 0);
                });
                array.push(result);
                index++;
            }
            return array;
        });
    }
    runScheduleRange(start = 0, end = this.scheduleArray.length - 1, ...params) {
        var _a;
        let index = 0;
        const array = [];
        for (const i of this.scheduleArray) {
            if (start > index) {
                index++;
                continue;
            }
            else if (end <= index) {
                break;
            }
            const result = i.fun(...(((_a = params[index]) === null || _a === void 0 ? void 0 : _a.length) ? params[index] : i.params));
            array.push(result);
            index++;
        }
        return array;
    }
    static sleep(time) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve) => {
                setTimeout(resolve, time);
            });
        });
    }
}
export { Schedule };
