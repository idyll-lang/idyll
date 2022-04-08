module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false
      }
    ],
    '@babel/preset-react'
  ],
  ignore: ['node_modules/**'],
  plugins: ['@babel/plugin-transform-runtime']
};
