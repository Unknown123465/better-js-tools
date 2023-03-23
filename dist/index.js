import { Schedule } from "./schedule";
const test = new Schedule();
test.addSchedule("first", console.log, 1000);
test.runScheduleOne(0, 1000, ["test"]);
