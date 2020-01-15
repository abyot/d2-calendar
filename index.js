import Ethiopian from './calendars/ethiopian/ethiopian';
import Nepali from './calendars/nepali/nepali';

let eDate = new Ethiopian("2011-13-4");

console.log('Ethiopian - toIso (2012-1-1):  ', Ethiopian.toIso("2012-1-1").toString());

console.log('Ethiopian - fromIso (2019-9-9):  ', Ethiopian.fromIso("2019-9-9").toString());

/*console.log('getFullYear (2019-9-9):  ', Ethiopian.fromIso("2019-9-9").getFullYear());

console.log('getMonth (2019-9-9):  ', Ethiopian.fromIso("2019-9-9").getMonth());

console.log('getDate (2019-9-9):  ', Ethiopian.fromIso("2019-9-9").getDate());

console.log('getMonthName (2019-9-9):  ', Ethiopian.fromIso("2019-9-9").getMonthName());

console.log('getShortMonthName (2019-9-9):  ', Ethiopian.fromIso("2019-9-9").getShortMonthName());

console.log('getDayOfWeek:  ', Ethiopian.fromIso("2019-9-9").getDayOfWeek());*/

console.log('Ethiopian - fromIso - today:  ', Ethiopian.fromIso(new Date()).toString());

console.log('Ethiopian - toIso - today:  ', Ethiopian.toIso(new Ethiopian()).toString());

console.log('Ethiopia - addDays:  ', eDate.addDays(5).toString());

let nDate = new Nepali();

console.log('Nepali - fromIso - today:  ', Nepali.fromIso(new Date()).toString());

console.log('Nepali - toIso - today:  ', Nepali.toIso(new Nepali()).toString());

console.log('Nepali - addDays:  ', nDate.addDays(31).toString());
