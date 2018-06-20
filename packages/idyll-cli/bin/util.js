module.exports.getLocalIdyll = function () {
  try {
    return require.resolve('idyll', { paths: [process.cwd()] });
  } catch (err) {
    return null;
  }
}
