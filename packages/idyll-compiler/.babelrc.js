const { BABEL_ENV, NODE_ENV } = process.env;

module.exports = {
  presets: [
    [
      'env',
      {
        loose: true,
        modules: 'commonjs',
      },
    ],
  ],
};
