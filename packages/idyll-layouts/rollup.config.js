import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';

const pkg = require('./package.json');
const dependencies = Object.keys(pkg.dependencies || {});

export default {
  input: 'src/index.js',
  external: [/@babel\/runtime/, ...dependencies],
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
      name: 'idyll-layouts'
    },
    {
      file: 'dist/esm/index.mjs',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**' // only transpile our source code
    }),
    commonjs()
  ]
};
