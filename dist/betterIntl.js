class DateTimeFormat {
    constructor(outputDateLang, outputTimeLang) {
        this.outputDateLang = outputDateLang;
        this.outputTimeLang = outputTimeLang;
    }
    static simpleDateFormat(format, date = Date.now(), timeZone) {
        const realDate = Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone }).format(date);
        const [year, month, day] = realDate.split("-");
        return format
            .replace(/Y{4}/g, year)
            .replace(/Y{2}/g, year.substring(2))
            .replace(/M{2}/g, month)
            .replace(/M{1}/g, month.substring(1))
            .replace(/D{2}/g, day)
            .replace(/D{1}/g, day.substring(1));
    }
    static simpleTimeFormat(format, date = Date.now(), timeZone) {
        const realDate = Intl.DateTimeFormat("ko", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone }).format(date);
        const [hour, minute, second] = realDate.split(":");
        return format
            .replace(/H{2}/g, hour)
            .replace(/H{1}/g, Number(hour) < 10 ? hour.substring(1) : hour)
            .replace(/h{2}/g, Number(hour) < 12 ? hour : (Number(hour) - 12).toString())
            .replace(/h{1}/g, Number(hour) < 12 ? hour.substring(1) : (Number(hour) - 12).toString())
            .replace(/M{2}/g, minute)
            .replace(/M{1}/g, minute.substring(1))
            .replace(/S{2}/g, second)
            .replace(/S{1}/g, second.substring(1));
    }
    mixDateTimeFormat(options, format = Date.now(), divide = "space") {
        const dateOption = {
            weekday: options.weekday,
            era: options.era,
            year: options.year,
            month: options.month,
            day: options.day,
            timeZone: options.timeZone,
            timeZoneName: options.timeZoneName,
            formatMatcher: options.formatMatcher,
        };
        const timeOption = {
            hour: options.hour,
            minute: options.minute,
            second: options.second,
            timeZone: options.timeZone,
            timeZoneName: options.timeZoneName,
            hour12: options.hour12,
            hourCycle: options.hourCycle,
            formatMatcher: options.formatMatcher,
        };
        const date = Intl.DateTimeFormat(this.outputDateLang, dateOption).format(format);
        const time = Intl.DateTimeFormat(this.outputTimeLang, timeOption).format(format);
        return date + (divide !== "none" ? (divide === "space" ? " " : "\n") : "") + time;
    }
}
class BetterIntl {
}
BetterIntl.DateTimeFormat = DateTimeFormat;
export { BetterIntl };
