import interval from "./interval";

export default interval(function(date) {
  date.setUTCSeconds(0, 0);
}, function(date, step) {
  date.setTime(+date + step * 6e4);
}, function(start, end) {
  return (end - start) / 6e4;
}, function(date) {
  return date.getUTCMinutes();
});
