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
    addSchedule(name, fun, time, params = []) {
        if (this.scheduleArray.some((f) => f.name === name)) {
            throw new TypeError("That schedule name already exists: " + name);
        }
        this.scheduleArray.push({ name: name !== null && name !== void 0 ? name : undefined, fun, time, params });
    }
    getSchedule(target) {
        if (typeof target === "number") {
            return this.scheduleArray[target];
        }
        else {
            return this.scheduleArray.find((f) => f.name === target);
        }
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
    runScheduleOne(target, time = 0, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const schedule = typeof target === "number" ? this.scheduleArray[target] : this.scheduleArray.find((f) => f.name);
            if (!schedule) {
                throw new Error("The schedule does not exist.");
            }
            yield new Promise((resolve) => {
                var _a;
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield schedule.fun(...params);
                    resolve(undefined);
                }), (_a = schedule.time) !== null && _a !== void 0 ? _a : time);
            });
        });
    }
    runScheduleAll(time = [], params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            for (const i of this.scheduleArray) {
                yield new Promise((resolve) => {
                    var _a, _b, _c, _d;
                    if (Array.isArray(params[index])) {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield i.fun(...params[index]);
                            resolve(undefined);
                        }), (_b = (_a = time[index]) !== null && _a !== void 0 ? _a : i.time) !== null && _b !== void 0 ? _b : 0);
                    }
                    else {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield i.fun();
                            resolve(undefined);
                        }), (_d = (_c = time[index]) !== null && _c !== void 0 ? _c : i.time) !== null && _d !== void 0 ? _d : 0);
                    }
                });
                index++;
            }
        });
    }
    runScheduleRange(start = 0, end = this.scheduleArray.length - 1, time = [], params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            for (const i of this.scheduleArray) {
                if (start > index) {
                    index++;
                    continue;
                }
                else if (end <= index) {
                    break;
                }
                yield new Promise((resolve) => {
                    var _a, _b, _c, _d;
                    if (Array.isArray(params[index])) {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield i.fun(...params[index]);
                            resolve(undefined);
                        }), (_b = (_a = time[index]) !== null && _a !== void 0 ? _a : i.time) !== null && _b !== void 0 ? _b : 0);
                    }
                    else {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield i.fun();
                            resolve(undefined);
                        }), (_d = (_c = time[index]) !== null && _c !== void 0 ? _c : i.time) !== null && _d !== void 0 ? _d : 0);
                    }
                });
                index++;
            }
        });
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
