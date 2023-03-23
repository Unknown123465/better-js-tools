

type ScheduleArray = {
    name:string|undefined,
    fun:Function,
    time:number|undefined,
    params:any[],
};

class Schedule {

    private scheduleArray:ScheduleArray[] = [];

    addSchedule(name:string|undefined, fun:Function, time:number|undefined, ...params:Array<any>) {

        if (this.scheduleArray.some((f) => f.name === name)) {
            throw new TypeError("That schedule name already exists: " + name);
        }

        this.scheduleArray.push({name : name ?? undefined, fun, time, params : [...params]});
    }

    getSchedule(target:number|string):ScheduleArray|undefined {

        if (typeof target === "number") {
            return this.scheduleArray[target];
        } else {
            return this.scheduleArray.find((f) => f.name === target);
        }
    }

    getScheduleRange(...range:Array<string|number>):ScheduleArray[] {
        
        const typeArray = ["string", "number", "undefined"];
        const errorIndex = range.findIndex((f) => !typeArray.includes(typeof f));
        if (!range.length) {
            throw new TypeError("Failed to execute 'getScheduleRange' on 'Schedule': 1 argument required, but only 0 present.");
        } else if (range.some((f, index, cb) => cb.some((f2) => typeof f2 !== typeof f))) {
            throw new TypeError(`The arguments types don't match.`);
        } else if (errorIndex > -1) {
            throw new TypeError(`The type of argument ${errorIndex + 1} is invalid. Valid types are ${typeArray.toString().replace(/,/g, ", ")}.`);
        }

        return this.scheduleArray.filter((f, index, cb) => range.some((f2) => f.name === f2) || (typeof range[0] === "number" && range[0] <= index && (typeof range[1] === "number" ? range[1] : cb.length) > index));
    }

    getScheduleAll():ScheduleArray[] {
        return this.scheduleArray;
    }

    setSchedule(target:number|string, fun:ScheduleArray|string|number|Array<any>) {

        let changeTarget:ScheduleArray|undefined = typeof target === "number" ? this.scheduleArray[target] : this.scheduleArray.find((f) => f.name);

        if (typeof changeTarget === "undefined") {
            throw new TypeError("The schedule does not exist.");
        } else if (typeof fun === "string") {
            changeTarget.name = fun;
        } else if (typeof fun === "number") {
            changeTarget.time = fun;
        } else if (Array.isArray(fun)) {
            changeTarget.params = fun;
        } else {
            changeTarget = fun;
        }

        this.scheduleArray = this.scheduleArray.map((f, index) => index === target || f.name === target ? changeTarget ?? f : f);
    }

    deleteSchedule(target:number|string) {

        this.scheduleArray = this.scheduleArray.filter((f, index) => !(index === target || f.name === target));
    }

    clearSchedule() {
        this.scheduleArray = [];
    }

    async runScheduleOnePromise(target:number|string, time:number|undefined = 0, ...params:Array<any>):Promise<any> {
        
        const schedule:ScheduleArray|undefined = typeof target === "number" ? this.scheduleArray[target] : this.scheduleArray.find((f) => f.name);
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

    runScheduleOne(target:number|string, ...params:Array<any>) {

        const schedule:ScheduleArray|undefined = typeof target === "number" ? this.scheduleArray[target] : this.scheduleArray.find((f) => f.name);
        if (!schedule) {
            throw new TypeError("The schedule does not exist.");
        }

        return schedule.fun(...(params.length ? params : schedule.params));
    }

    async runScheduleAllPromise(time:number[] = [], ...params:Array<any[]>):Promise<any[]> {

        let index = 0;
        const array:any[] = [];
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

    runScheduleAll(...params:Array<any[]>):any[] {

        const array:any[] = [];
        this.scheduleArray.forEach((f, index) => {

            const result = f.fun(...(params[index]?.length ? params[index] : f.params));
            array.push(result);
        });

        return array;
    }

    async runScheduleRangePromise(start:number = 0, end:number = this.scheduleArray.length - 1, time:number[] = [], ...params:Array<any[]>):Promise<any[]> {

        let index = 0;
        const array = [];
        for (const i of this.scheduleArray) {

            if (start > index) {
                index++;
                continue;
            } else if (end <= index) {
                break;
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

    runScheduleRange(start:number = 0, end:number = this.scheduleArray.length - 1, ...params:Array<any[]>):any[] {

        let index = 0;
        const array = [];
        for (const i of this.scheduleArray) {

            if (start > index) {
                index++;
                continue;
            } else if (end <= index) {
                break;
            }

            const result = i.fun(...(params[index]?.length ? params[index] : i.params));

            array.push(result);
            index++;
        }

        return array;
    }

    static async sleep(time:number) {

        await new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }
}

export {Schedule};