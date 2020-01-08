import Ethiopian from './calendars/ethiopian/ethiopian';

let date = new Ethiopian();

/*console.log('toIso (2012-1-1):  ', Ethiopian.toIso("2012-1-1").toString());

console.log('fromIso (2019-9-9):  ', Ethiopian.fromIso("2019-9-9").toString());

console.log('getFullYear (2019-9-9):  ', Ethiopian.fromIso("2019-9-9").getFullYear());

console.log('getMonth (2019-9-9):  ', Ethiopian.fromIso("2019-9-9").getMonth());

console.log('getDate (2019-9-9):  ', Ethiopian.fromIso("2019-9-9").getDate());

console.log('getMonthName (2019-9-9):  ', Ethiopian.fromIso("2019-9-9").getMonthName());

console.log('getShortMonthName (2019-9-9):  ', Ethiopian.fromIso("2019-9-9").getShortMonthName());

console.log('getDayOfWeek:  ', Ethiopian.fromIso("2019-9-9").getDayOfWeek());

console.log('fromIso - today:  ', Ethiopian.fromIso(new Date()).toString());

console.log('toIso - today:  ', Ethiopian.toIso(new Ethiopian()).toString());*/

console.log('addDays:  ', date.addDays(2).toString());

console.log('addMonths:  ', date.addMonths(2).toString());

console.log('addYears:  ', date.addYears(2).toString());