import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import fs from 'fs';

const builds = [];
fs.readdirSync(`${__dirname}/src/`).forEach(file => {
  builds.push({
    input: `src/${file}`,
    output: [
      {
        file: `dist/cjs/${file}`,
        format: 'cjs',
        sourcemap: false,
        name: 'idyll-components'
      },
      {
        file: 'dist/esm/index.mjs',
        format: 'esm',
        sourcemap: false
      }
    ],
    plugins: [
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**' // only transpile our source code
      }),
      commonjs()
    ]
  });
});

export default builds;
