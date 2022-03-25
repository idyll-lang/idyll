import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import fs from 'fs';
import path from 'path';

const builds = [];
fs.readdirSync(`${__dirname}/src/`).forEach(file => {
  builds.push({
    input: `src/${file}`,
    output: [
      {
        file: `dist/cjs/${file}`,
        format: 'cjs',
        sourcemap: false,
        name: 'idyll-components',
        exports: 'auto'
      },
      {
        file: `dist/esm/${path.parse(file).name}.mjs`,
        format: 'esm',
        sourcemap: false,
        exports: 'auto'
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
