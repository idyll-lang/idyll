import locale from "./locale/en-US";

var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

function formatIsoNative(date) {
  return date.toISOString();
}

formatIsoNative.parse = function(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
};

formatIsoNative.toString = function() {
  return isoSpecifier;
};

var formatIso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z")
    ? formatIsoNative
    : locale.utcFormat(isoSpecifier);

export default formatIso;
