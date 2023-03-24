
type FormatOptions = {
    weekday?: 'narrow' | 'short' | 'long' | undefined,
    era?: 'narrow' | 'short' | 'long' | undefined,
    year?: 'numeric' | '2-digit' | undefined,
    month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long' | undefined,
    day?: 'numeric' | '2-digit' | undefined,
    hour?: 'numeric' | '2-digit' | undefined,
    minute?: 'numeric' | '2-digit' | undefined,
    second?: 'numeric' | '2-digit' | undefined,
    timeZoneName?: 'short' | 'long' | undefined,
  
    // Time zone to express it in
    timeZone?: string | undefined,
    // Force 12-hour or 24-hour
    hour12?: boolean,
  
    // Rarely-used options
    hourCycle?: 'h11' | 'h12' | 'h23' | 'h24' | undefined,
    formatMatcher?: 'basic' | 'best fit' | undefined
};

type ListOption = {
    falsy?:boolean,
    nullish?:boolean,

    localeMatcher:"best fit"|"lookup",
    type?:"conjunction"|"disjunction"|"unit",
    style:"long"|"short"|"narrow",
};

class DateTimeFormat {

    constructor(
        public outputDateLang?:string|undefined,
        public outputTimeLang?:string|undefined,
    ) {}

    static simpleDateFormat(format:string, date:Date|number = Date.now(), timeZone?:string|undefined):string {

        const realDate = Intl.DateTimeFormat("fr-CA", {year : "numeric", month : "2-digit", day : "2-digit", timeZone}).format(date);

        const [year, month, day] = realDate.split("-");
        
        return format
        .replace(/Y{4}/g, year)
        .replace(/Y{2}/g, year.substring(2))
        .replace(/M{2}/g, month)
        .replace(/M{1}/g, Number(month) < 10 ? month.substring(1) : month)
        .replace(/D{2}/g, day)
        .replace(/D{1}/g, Number(day) < 10 ? day.substring(1) : day);
    }

    static simpleTimeFormat(format:string, date:Date|number = Date.now(), timeZone?:string|undefined):string {

        const realDate = Intl.DateTimeFormat("ko", {hour : "2-digit", minute : "2-digit", second : "2-digit", hour12 : false, timeZone}).format(date);

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

    langChnage(langType:"date"|"time", value:string) {
        this[langType === "date" ? "outputDateLang" : "outputTimeLang"] = value;
    }

    mixDateTimeFormat(options:FormatOptions, format:Date|number = Date.now(), divide:"space"|"break"|"none"|string = "space"):string {
        const dateOption = {
            weekday : options.weekday,
            era : options.era,
            year : options.year,
            month : options.month,
            day : options.day,
            timeZone : options.timeZone,
            timeZoneName : options.timeZoneName,
            formatMatcher : options.formatMatcher,
        };

        const timeOption = {
            hour : options.hour ?? "2-digit",
            minute : options.minute ?? "2-digit",
            second : options.second ?? "2-digit",
            timeZone : options.timeZone,
            timeZoneName : options.timeZoneName,
            hour12 : options.hour12 ?? true,
            hourCycle : options.hourCycle,
            formatMatcher : options.formatMatcher,
        };
        
        const date = Intl.DateTimeFormat(this.outputDateLang, dateOption).format(format);
        const time = Intl.DateTimeFormat(this.outputTimeLang, timeOption).format(format);

        const customDivide:any = {
            none : "",
            space : " ",
            break : "\n",
        };

        return date + (customDivide[divide] ?? divide) + time;
    }
}

class ListFormat extends Intl.ListFormat {

    constructor(
        private lang?:string,
        private option:ListOption = {falsy : false, nullish : false, localeMatcher : "best fit", style : "long"},
    ) {
        super();
    }

    format(value:any[]):string {

        let array = value;
        if (!this.option.falsy) {
            array = array.filter((f) => f || f === null || f === undefined);
        }
        
        if (!this.option.nullish) {
            array = array.filter((f) => f !== null && f !== undefined);
        }

        array = array.map((f) => String(f));

        return new Intl.ListFormat(this.lang, this.option).format(array);
    }
}

class BetterIntl {
    public static readonly DateTimeFormat = DateTimeFormat;
    public static readonly ListFormat = ListFormat;
}

export default BetterIntl;