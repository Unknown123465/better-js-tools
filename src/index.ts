import { BetterIntl } from "./betterIntl.js";
import { NumberTools } from "./number.js";
import {Schedule} from "./schedule.js";

(async() => {
    const test = new Schedule();

    test.addSchedule("first", console.log, 1000);

    console.log(1);
    
    await test.runScheduleOnePromise(0, 1000);
    console.log(test.getSchedule("first"))

    test.setSchedule(0, 100);
    await test.runScheduleOne(0, ["test2"]);


    for (let i = 1; i <= 5; i++) {

        test.addSchedule(`index=${i}`, console.log, undefined, [i, i * 2]);
    }

    console.log("----------------------");
    
    //await test.runScheduleAll([["test"]], [1000, 1000, 1000, 1000, 1000]);
    
    //await test.runScheduleRangePromise(0, 2, [["test"], [1], [2], [3]], [500, 500]);

    console.log(test.getScheduleRange("first", "index=3", "adsad"));

    const dateFormat = new BetterIntl.DateTimeFormat("fr-CA", "ko");
    //console.log(BetterIntl.DateTimeFormat.simpleDateFormat("YYYY.MM.DD"))
    console.log(dateFormat.mixDateTimeFormat({year : "numeric", month : "2-digit", day : "2-digit", hour12 : false}, new Date(), "*"))
})/*()*/;

(async() => {

    console.log(NumberTools.getNumberArray(0, 10));
    console.log(NumberTools.getRandomNumber(0, 10, 20, "int"));
    //console.log(new BetterIntl.ListFormat("ko", {}).format([1,2,3, null, undefined, ""]))
    
})()

export class JSTools {
    public static readonly Schedule = Schedule;
    public static readonly BetterIntl = BetterIntl;
    public static readonly NumberTools = NumberTools;
};