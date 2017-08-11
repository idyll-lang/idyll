const flattenObject = (name, obj) => {
  const output = {};
  if (obj === undefined || obj === null) {
    return output;
  }
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (typeof val === 'object') {
      const results = flattenObject(key, val);
      Object.keys(results).forEach((result) => {
        output[name + result] = results[result];
      });
    } else {
      output[name + key] = val;
    }
  });
  return output;
};

module.exports = {
  flattenObject: flattenObject
};
