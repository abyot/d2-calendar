import { gregorian } from "./constants"
import { mod, quotient, CalendarValidationException } from "../utils";

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default class GregorianCalendar {

    static validate(year, month, day) {
        if (month < 1 || month > 12) {
            throw new CalendarValidationException('Invalid month:  ' + month)
        }

        if (day < 1) {
            throw new CalendarValidationException('Invalid date:  ' + day)
        }

        const febDays = GregorianCalendar.isLeapYear(year) ? 29 : 28

        if (month === gregorian.Month.FEBRUARY && day <= febDays) {
            return
        }

        if (daysInMonth[month - 1] < day) {
            throw new CalendarValidationException('Invalid date:  ' + day)
        }
    }

    static isLeapYear(year) {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
    }

    static jdnToYear(jdn) {
        const jd0 = Math.floor(jdn - 0.5) + 0.5
        const depoch = jd0 - gregorian.EPOCH
        const quadricent = Math.floor(depoch / 146097)
        const dqc = mod(depoch, 146097)
        const cent = Math.floor(dqc / 36524)
        const dcent = mod(dqc, 36524)
        const quad = Math.floor(dcent / 1461)
        const dquad = mod(dcent, 1461)
        const yindex = Math.floor(dquad / 365)

        return quadricent * 400 + cent * 100 + quad * 4 + yindex + ((cent !== 4 && yindex !== 4) ? 1 : 0)
    }

    static fromJdn(jdn) {

        const r2000 = mod((jdn - gregorian.EPOCH), 730485);
        const r400 = mod((jdn - gregorian.EPOCH), 146097);
        const r100 = mod(r400, 36524);
        const r4 = mod(r100, 1461);
        let n = mod(r4, 365) + 365 * quotient(r4, 1460);
        const s = quotient(r4, 1095);
        const aprime = 400 * quotient((jdn - gregorian.EPOCH), 146097) +
            100 * quotient(r400, 36524) +
            4 * quotient(r100, 1461) +
            quotient(r4, 365) -
            quotient(r4, 1460) -
            quotient(r2000, 730484);
        const year = aprime + 1;
        const t = quotient((364 + s - n), 306);
        let month = t * (quotient(n, 31) + 1) + (1 - t) * (quotient((5 * (n - s) + 13), 153) + 1);
        n += 1 - quotient(r2000, 730484);
        let day = n;


        if ((r100 === 0) && (n === 0) && (r400 !== 0)) {
            month = 12;
            day = 31;
        } else {
            gregorian.monthDays[2] = (GregorianCalendar.isLeapYear(year)) ? 29 : 28;
            for (let i = 1; i <= gregorian.monthCount; i += 1) {
                if (n <= gregorian.monthDays[i]) {
                    day = n;
                    break;
                }
                n -= gregorian.monthDays[i];
            }
        }

        return new Date(year, month-1, day);

        /*const jd0 = Math.floor(jdn - 0.5) + 0.5
        const year = GregorianCalendar.jdnToYear(jd0)
        const yearDate = jd0 - GregorianCalendar.toJdn(year, 1, 1)
        const leapAdj = jd0 < GregorianCalendar.toJdn(year, 3, 1) ? 0 : GregorianCalendar.isLeapYear(year) ? 1 : 2
        const month = Math.floor(((yearDate + leapAdj) * 12 + 373) / 367)
        const date = jd0 - GregorianCalendar.toJdn(year, month, 1) + 1

        return new Date(year, month, date);*/
    }

    static toJdn(year, month, day) {

        GregorianCalendar.validate(year, month, day);


        const s = quotient(year, 4) -
            quotient(year - 1, 4) -
            quotient(year, 100) +
            quotient(year - 1, 100) +
            quotient(year, 400) -
            quotient(year - 1, 400);

        const t = quotient(14 - month, 12);

        const n = 31 * t * (month - 1) +
            (1 - t) * (59 + s + 30 * (month - 3) + quotient((3 * month - 7), 5)) +
            day - 1;

        const j = gregorian.EPOCH +
            365 * (year - 1) +
            quotient(year - 1, 4) -
            quotient(year - 1, 100) +
            quotient(year - 1, 400) +
            n;

        return j;

        /*const y1 = year - 1

        return gregorian.EPOCH - 1 + 365 * y1 +
            Math.floor(y1 / 4) -
            Math.floor(y1 / 100) +
            Math.floor(y1 / 400) +
            Math.floor((367 * month - 362) / 12 +
                (month <= 2 ? 0 : GregorianCalendar.isLeapYear(year) ? -1 : -2) + day);*/
                
    }

    static dateDifference(date1, date2) {
        return date2.getJdn() - date1.getJdn()
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