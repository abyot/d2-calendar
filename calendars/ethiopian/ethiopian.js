import GregorianCalendar from '../gregorian/GregorianCalendar'
import { mod, quotient, dateAsArrayString, CalendarValidationException } from "../utils";
import { ethiopian } from "./constants";

export default class EthiopianCalendar {
    /**
     * @param { number | string } year - A numeric year value if second and third parameters are provided, otherwise a date string
     * @param { number } month A zero-based numeric value for the month
     * @param { number } day A numeric value equal for the day of the month.
     */
    constructor(year, month, day) {
        if (arguments.length === 0) {
            const _date = EthiopianCalendar.fromIso(new Date());
            [this.year, this.month, this.date] = dateAsArrayString(_date);
        } else if (arguments.length === 1) {
            if (typeof year === "string") {
                const _date = EthiopianCalendar.parse(year);
                [this.year, this.month, this.date] = dateAsArrayString(_date);
            } else if (typeof year === "object" && year instanceof Date) {
                const _date = EthiopianCalendar.fromIso(
                    year.getFullYear(),
                    year.getMonth(),
                    year.getDate()
                );
                [this.year, this.month, this.date] = dateAsArrayString(_date);
            } else {
                throw new Error("Invalid Argument Exception");
            }
        } else if (arguments.length === 3) {
            this.year = parseInt(year, 10);
            this.month = parseInt(month, 10);
            this.date = parseInt(day, 10);
        } else {
            throw new Error("Invalid Argument Exception");
        }
    }

    /**
     * Converts a Ethiopian date to ISO / Gregorian date.
     * @param { number | string  } year - A numeric year value if second and third parameters are provided, otherwise a date string
     * @param { number } month A zero-based numeric value for the month (0 for January, 11 for December)
     * @param { number } day A numeric value equal for the day of the month.
     * @returns ISO date object
     * @api public
     */
    static toIso(year, month, day) {
        let _date;
        if (arguments.length === 1) {
            if (typeof year === "string") {
                _date = dateAsArrayString(new EthiopianCalendar(year), true);
            } else if (typeof year === "object" && year instanceof EthiopianCalendar) {
                _date = dateAsArrayString(year, true);
            } else {
                throw new Error("Invalid Argument Exception");
            }
        } else if (arguments.length === 3) {
            _date = [year, month + 1, day];
        } else {
            throw new Error("Invalid Argument Exception");
        }

        _date[1] = _date[1] == 1 ? 2 : _date[1];

        let jdn = EthiopianCalendar.toJdn(_date[0], _date[1] - 1, _date[2]);

        return GregorianCalendar.fromJdn(jdn);
    }

    /**
     * Converts ISO / Gregorian date to Ethiopian date.
     * @param { number | string  } year - A numeric year value if second and third parameters are provided, otherwise a date string
     * @param { number } month A zero-based numeric value for the month (0 for January, 11 for December)
     * @param { number } day A numeric value equal for the day of the month.
     * @returns Ethiopian date object
     * @api public
     */
    static fromIso(year, month, day) {
        let _date;
        if (arguments.length === 1) {
            if (typeof year === "string") {
                _date = dateAsArrayString(new Date(year), true);
            } else if (typeof year === "object" && year instanceof Date) {
                _date = dateAsArrayString(year, true);
            } else {
                throw new Error("Invalid Argument Exception");
            }
        } else if (arguments.length === 3) {
            _date = [year, month + 1, day];
        } else {
            throw new Error("Invalid Argument Exception");
        }

        let jdn = GregorianCalendar.toJdn(_date[0], _date[1], _date[2]);

        return EthiopianCalendar.fromJdn(jdn);
    }

    static fromJdn(jdn) {

        const r = mod((jdn - ethiopian.EPOCH), 1461);
        const n = mod(r, 365) + 365 * quotient(r, 1460);
        const year = 4 * quotient((jdn - ethiopian.EPOCH), 1461) + quotient(r, 365) - quotient(r, 1460);
        const month = quotient(n, 30) + 1;
        const day = mod(n, 30) + 1;

        return new EthiopianCalendar(year, month, day)
    }

    static toJdn(year, month, day) {

        EthiopianCalendar.validate(year, month, day);

        return (ethiopian.EPOCH + 365) + 
            365 * (year - 1) + 
            quotient(year, 4) + 
            30 * month +  
            day - 31;

    }

    static isLeapYear(year) {
        return mod(year, 4) === 0
    }

    static validate(year, month, day) {
        if (month < 1 || month > ethiopian.monthCount) {
            throw new CalendarValidationException('Invalid month:  ' + month)
        }

        const daysInLeapYearMonth = EthiopianCalendar.isLeapYear(year) ? 6 : 5

        if (month === ethiopian.monthCount && day > daysInLeapYearMonth) {
            throw new CalendarValidationException('Invalid day:  ' + day)
        }

        if (day < 1 || day > 30) {
            throw new CalendarValidationException('Invalid day:  ' + day)
        }
    }

    /**
     * Parse Ethiopian date from string
     * @param { string } dateString a date string to parse
     * @param { string } pattern a parsing pattern. yyyy-mm-dd is the default.
     * @returns Ethiopian object
     */
    static parse(dateString, pattern) {
        if (!dateString) {
            return "";
        }
        if (!pattern) {
            const _date = dateString.split("-");
            if (_date.length === 3) {
                const [y, m, d] = _date;
                return new EthiopianCalendar(y, m - 1, d);
            }
            throw new Error(`ParsingError: Can't parse ${dateString}`);
        } else {
            throw new Error("Not implemented Exception :(");
        }
    }

    format(pattern) {
        return Formatter.format(this, pattern);
    }

    getDate() {
        return this.date;
    }

    getMonth() {
        return this.month;
    }

    getFullYear() {
        return this.year;
    }

    getMonthName() {
        return ethiopian.monthNames[this.month - 1];
    }

    getShortMonthName() {
        return ethiopian.monthNamesShort[this.month - 1];
    }

    getDayOfWeek() {

        let _date = EthiopianCalendar.toIso(this.year, this.month, this.date);
        
        let weekDay = _date.getDay();

        return ethiopian.dayNames[weekDay];

    }

    addDays( days ) {

        if ( isNaN( days) ){
            throw new CalendarValidationException('Invalid days to add:  ' + days)
        }

        let _date = EthiopianCalendar.toIso(this.year, this.month, this.date);

        _date.setDate( _date.getDate() + days );

        return EthiopianCalendar.fromIso( _date );
    }

    addMonths( months )
    {
        if ( isNaN( months) ){
            throw new CalendarValidationException('Invalid months to add:  ' + months)
        }

        let _date = EthiopianCalendar.toIso(this.year, this.month, this.date);

        _date.setMonth( _date.getMonth() + months );

        return EthiopianCalendar.fromIso( _date );
    }

    addYears( years )
    {
        if ( isNaN( years ) ){
            throw new CalendarValidationException('Invalid years to add:  ' + years)
        }

        let _date = EthiopianCalendar.toIso(this.year, this.month, this.date);

        _date.setFullYear( _date.getFullYear() + years );

        return EthiopianCalendar.fromIso( _date );
    }

    toString() {
        return `${this.year}-${this.month}-${this.date}`;
    }

    toArray() {
        return [
            this.year,
            this.month,
            this.date
        ]
    }
}