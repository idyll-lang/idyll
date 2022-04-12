import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const pkg = require('./package.json');
const dependencies = Object.keys(pkg.dependencies || {});

export default [
  {
    input: 'src/index.js',
    external: [/@babel\/runtime/, ...dependencies],
    output: [
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
        name: 'idyll-ast'
      },
      {
        file: 'dist/esm/index.mjs',
        format: 'esm',
        sourcemap: true,
        exports: 'auto'
      }
    ],
    plugins: [
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**' // only transpile our source code
      }),
      json({
        compact: true
      }),
      nodeResolve(),
      commonjs()
    ]
  },
  {
    input: 'v1/src/index.js',
    external: [/@babel\/runtime/, ...dependencies],
    output: [
      {
        file: 'dist/cjs/v1/index.js',
        format: 'cjs',
        sourcemap: true,
        name: 'idyll-ast'
      },
      {
        file: 'dist/esm/v1/index.mjs',
        format: 'esm',
        sourcemap: true,
        exports: 'auto'
      }
    ],
    plugins: [
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**' // only transpile our source code
      }),
      json({
        compact: true
      }),
      commonjs()
    ]
  }
];
