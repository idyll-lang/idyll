const BABEL_ENV = process.env.BABEL_ENV;
const env = {
  cjs: 'env',
  es: [
    'env', { loose: true, modules: false }
  ],
  test: [
    'es2015'
  ]
}[BABEL_ENV || 'cjs'];

module.exports = {
  plugins: ['transform-object-rest-spread'],
  presets: [
    env,
    'react',
  ],
};
