const BABEL_ENV = process.env.BABEL_ENV;
const env = BABEL_ENV === 'cjs' ? 'env' : [
  'env', { loose: true, modules: false }
]

module.exports = {
  plugins: ['transform-object-rest-spread'],
  presets: [
    env,
    'react',
  ],
};
