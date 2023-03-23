var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BetterIntl } from "./betterIntl.js";
import { Schedule } from "./schedule.js";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const test = new Schedule();
    test.addSchedule("first", console.log, 1000);
    console.log(1);
    yield test.runScheduleOnePromise(0, 1000);
    console.log(test.getSchedule("first"));
    test.setSchedule(0, 100);
    yield test.runScheduleOne(0, ["test2"]);
    for (let i = 1; i <= 5; i++) {
        test.addSchedule(`index=${i}`, console.log, undefined, [i, i * 2]);
    }
    console.log("----------------------");
    //await test.runScheduleAll([["test"]], [1000, 1000, 1000, 1000, 1000]);
    //await test.runScheduleRangePromise(0, 2, [["test"], [1], [2], [3]], [500, 500]);
    console.log(test.getScheduleRange("first", "index=3", "adsad"));
    const dateFormat = new BetterIntl.DateTimeFormat("fr-CA", "ko");
    //console.log(BetterIntl.DateTimeFormat.simpleDateFormat("YYYY.MM.DD"))
    console.log(dateFormat.mixDateTimeFormat({ year: "numeric", month: "2-digit", day: "2-digit", hour12: true }));
}))();
