import interval from "./interval";

export default interval(function(date) {
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function(start, end) {
  return (end - start) / 864e5;
}, function(date) {
  return date.getUTCDate() - 1;
});
