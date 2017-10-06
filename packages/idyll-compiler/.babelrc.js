const { BABEL_ENV, NODE_ENV } = process.env;

module.exports = {
  presets: [
    [
      'env',
      {
        loose: true,
        modules: BABEL_ENV === 'cjs' || NODE_ENV === 'test' ? 'commonjs' : false,
      },
    ],
  ],
};
