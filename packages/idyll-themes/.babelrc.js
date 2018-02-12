const { BABEL_ENV, NODE_ENV } = process.env;

module.exports = {
  plugins: ['transform-object-rest-spread'],
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
