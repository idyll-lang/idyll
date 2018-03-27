

module.exports = function (input, options) {
  const processor = {
    pipe: function (func) {
      input = func(input, options);
      return processor;
    },
    end: function () {
      return input;
    }
  }

  return processor;
}
