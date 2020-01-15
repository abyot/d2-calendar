import GregorianCalendar from '../gregorian/GregorianCalendar'
import { mod, quotient, dateAsArrayString, CalendarValidationException } from "../utils";
import { nepali } from "./constants";

export default class NepaliCalendar {
    /**
     * @param { number | string } year - A numeric year value if second and third parameters are provided, otherwise a date string
     * @param { number } month A numeric month value
     * @param { number } day A numeric day value
     */
    constructor(year, month, day) {
        if (arguments.length === 0) {
            const _date = NepaliCalendar.fromIso(new Date());
            [this.year, this.month, this.date] = dateAsArrayString(_date);
        } else if (arguments.length === 1) {
            if (typeof year === "string") {
                const _date = NepaliCalendar.parse(year);
                [this.year, this.month, this.date] = dateAsArrayString(_date);
            } else if (typeof year === "object" && year instanceof Date) {
                const _date = NepaliCalendar.fromIso(
                    year.getFullYear(),
                    year.getMonth() + 1,
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
     * Converts a Nepali date to ISO / Gregorian date.
     * @param { number | string  } year - A numeric year value if second and third parameters are provided, otherwise a date string
     * @param { number } month A numeric month value
     * @param { number } day A numeric day value
     * @returns ISO date object
     * @api public
     */
    static toIso(year, month, day) {
        let _date;
        if (arguments.length === 1) {
            if (typeof year === "string") {
                _date = dateAsArrayString(new NepaliCalendar(year));
            } else if (typeof year === "object" && year instanceof NepaliCalendar) {
                _date = dateAsArrayString(year);
            } else {
                throw new Error("Invalid Argument Exception");
            }
        } else if (arguments.length === 3) {
            _date = [year, month, day];
        } else {
            throw new Error("Invalid Argument Exception");
        }

        let jdn = this.toJdn(_date[0], _date[1], _date[2]);

        return GregorianCalendar.fromJdn(jdn);
    }

    /**
     * Converts ISO / Gregorian date to Nepali date.
     * @param { number | string  } year - A numeric year value if second and third parameters are provided, otherwise a date string
     * @param { number } month A numeric month value
     * @param { number } day A numeric day value
     * @returns Nepali date object
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

        return this.fromJdn(jdn);
    }

    static fromJdn(jdn) {

        let _date = GregorianCalendar.fromJdn(jdn);
        let gregorianDayOfYear = GregorianCalendar.getDayOfYear(_date);

        let year = _date.getFullYear() + 56;
        let month = 9;

        var dayOfFirstJanInPaush = nepali.daysInMonth[year][0];
        var daysSinceJanFirstToEndOfNepaliMonth = nepali.daysInMonth[year][month] - dayOfFirstJanInPaush + 1;

        while (gregorianDayOfYear > daysSinceJanFirstToEndOfNepaliMonth) {
            month++;
            if (month > 12) {
                month = 1;
                year++;
            }	
            daysSinceJanFirstToEndOfNepaliMonth += nepali.daysInMonth[year][month];
        }

        let day = nepali.daysInMonth[year][month] - (daysSinceJanFirstToEndOfNepaliMonth - gregorianDayOfYear);

        return new NepaliCalendar(year, month, day)
    }

    static toJdn(year, month, day) {

        this.validate(year, month, day);

        let _year = year;
        let _month = month;
        let _day = day;
        let daysSinceFirstJan = 0;

        /**
         * Get Gregorian year by subtracting either
         * 56 (if Nepali's month is Paush) or 57 (otherwise)
         * from the given Nepali year
         * 
         */
        let y = year - ( _month > 9 || (_month === 9 && day >= nepali.daysInMonth[_year][0] ) ? 56: 57 );

        if( month !== 9 ){
            daysSinceFirstJan = day;
            _month--;
        }

        while( _month !== 9 ){
            if(_month <= 0){
                _month = 12;
                _year--;
            }
            daysSinceFirstJan += nepali.daysInMonth[_year][_month];
            _month--;
        }

        if( month === 9 ){
            daysSinceFirstJan += day - nepali.daysInMonth[_year][0];

            if(daysSinceFirstJan < 0){
                daysSinceFirstJan += GregorianCalendar.daysInYear(y);
            }
        }
        else{
            daysSinceFirstJan += nepali.daysInMonth[_year][9] - nepali.daysInMonth[_year][0];
        }

        let gDate = new Date();

        gDate.setFullYear(y);
        gDate.setMonth(1);
        gDate.setDate( 1 + daysSinceFirstJan );

        let _date = dateAsArrayString(gDate);

        return GregorianCalendar.toJdn( _date[0], _date[1], _date[2] );

    }

    static isLeapYear(year) {
        return this.daysInYear(year) !== nepali.daysPerYear;
    }

    static daysInYear(year){
        if( typeof nepali.daysInMonth[year] == 'undefined' ){
            return nepali.daysPerYear;
        }

        let totalDays = 0;
        for(let m = 1; m <= nepali.monthCount; m++){
            totalDays += nepali.daysInMonth[year][m];
        }

        return totalDays;
    }

    static validate(year, month, day) {
        
        return  year >= 2000 && year <= 2099 &&
          month >= 1 && month <= 12 &&
          day >= 1 && day <= this.getDaysInMonth(year, month)
    }

    static getDaysInMonth(year, month){
        return nepali.daysInMonth[year][month];
    }

    /**
     * Parse Nepali date from string
     * @param { string } dateString a date string to parse
     * @param { string } pattern a parsing pattern. yyyy-mm-dd is the default.
     * @returns Nepali object
     */
    static parse(dateString, pattern) {
        if (!dateString) {
            return "";
        }
        if (!pattern) {
            const _date = dateString.split("-");
            if (_date.length === 3) {
                const [y, m, d] = _date;
                return new NepaliCalendar(y, m, d);
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
        return nepali.monthNames[this.month - 1];
    }

    getShortMonthName() {
        return nepali.monthNamesShort[this.month - 1];
    }

    getDayOfWeek() {

        let _date = this.toIso(this.year, this.month, this.date);
        
        let weekDay = _date.getDay();

        return nepali.dayNames[weekDay];

    }

    addDays( days ) {

        if ( isNaN( days) ){
            throw new CalendarValidationException('Invalid days to add:  ' + days)
        }

        let _date = NepaliCalendar.toIso(this.year, this.month, this.date);

        _date.setDate( _date.getDate() + days );

        return NepaliCalendar.fromIso( _date );
    }

    addMonths( months )
    {
        if ( isNaN( months) ){
            throw new CalendarValidationException('Invalid months to add:  ' + months)
        }

        let _date = NepaliCalendar.toIso(this.year, this.month, this.date);

        _date.setMonth( _date.getMonth() + months );

        return NepaliCalendar.fromIso( _date );
    }

    addYears( years )
    {
        if ( isNaN( years ) ){
            throw new CalendarValidationException('Invalid years to add:  ' + years)
        }

        let _date = NepaliCalendar.toIso(this.year, this.month, this.date);

        _date.setFullYear( _date.getFullYear() + years );

        return NepaliCalendar.fromIso( _date );
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