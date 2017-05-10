export {default as interval} from "./src/interval";

import millisecond from "./src/millisecond";
import second from "./src/second";
import minute from "./src/minute";
import hour from "./src/hour";
import day from "./src/day";
import {default as week, sunday, monday, tuesday, wednesday, thursday, friday, saturday} from "./src/week";
import month from "./src/month";
import year from "./src/year";

import utcSecond from "./src/utcSecond";
import utcMinute from "./src/utcMinute";
import utcHour from "./src/utcHour";
import utcDay from "./src/utcDay";
import {default as utcWeek, utcSunday, utcMonday, utcTuesday, utcWednesday, utcThursday, utcFriday, utcSaturday} from "./src/utcWeek";
import utcMonth from "./src/utcMonth";
import utcYear from "./src/utcYear";

export var milliseconds = millisecond.range;
export var seconds = second.range;
export var minutes = minute.range;
export var hours = hour.range;
export var days = day.range;
export var sundays = sunday.range;
export var mondays = monday.range;
export var tuesdays = tuesday.range;
export var wednesdays = wednesday.range;
export var thursdays = thursday.range;
export var fridays = friday.range;
export var saturdays = saturday.range;
export var weeks = week.range;
export var months = month.range;
export var years = year.range;

export var utcMillisecond = millisecond;
export var utcMilliseconds = milliseconds;
export var utcSeconds = utcSecond.range;
export var utcMinutes = utcMinute.range;
export var utcHours = utcHour.range;
export var utcDays = utcDay.range;
export var utcSundays = utcSunday.range;
export var utcMondays = utcMonday.range;
export var utcTuesdays = utcTuesday.range;
export var utcWednesdays = utcWednesday.range;
export var utcThursdays = utcThursday.range;
export var utcFridays = utcFriday.range;
export var utcSaturdays = utcSaturday.range;
export var utcWeeks = utcWeek.range;
export var utcMonths = utcMonth.range;
export var utcYears = utcYear.range;

export {
  millisecond,
  second,
  minute,
  hour,
  day,
  sunday,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  week,
  month,
  year,
  utcSecond,
  utcMinute,
  utcHour,
  utcDay,
  utcSunday,
  utcMonday,
  utcTuesday,
  utcWednesday,
  utcThursday,
  utcFriday,
  utcSaturday,
  utcWeek,
  utcMonth,
  utcYear
};
