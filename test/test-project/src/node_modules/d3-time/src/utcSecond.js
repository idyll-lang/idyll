import interval from "./interval";

export default interval(function(date) {
  date.setUTCMilliseconds(0);
}, function(date, step) {
  date.setTime(+date + step * 1e3);
}, function(start, end) {
  return (end - start) / 1e3;
}, function(date) {
  return date.getUTCSeconds();
});
