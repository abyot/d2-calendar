export function mod(a, b)
{
    return a % b;
    //return a - b * Math.floor(a / b);
}

export function quotient(a, b){
    return Math.floor(a / b);
}

export function dateAsArrayString(date, zeroMonthCount = false) {
    return [date.getFullYear(), !zeroMonthCount ? date.getMonth() : date.getMonth() + 1, date.getDate() ];
}

export class CalendarValidationException extends Error {
    constructor(error) {
        super(error)
    }
}