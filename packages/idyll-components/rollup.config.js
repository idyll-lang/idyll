import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import fs from 'fs';
import path from 'path';

const pkg = require('./package.json');
const dependencies = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];

const builds = [];
fs.readdirSync(`${__dirname}/src/`).forEach(file => {
  builds.push({
    input: `src/${file}`,
    external: [/@babel\/runtime/, /react-syntax-highlighter/, ...dependencies],
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
