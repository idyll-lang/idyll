import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { babel } from '@rollup/plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
      name: 'idyll-document',
      exports: 'auto'
    },
    {
      file: 'dist/esm/index.mjs',
      format: 'esm',
      sourcemap: true,
      exports: 'auto',
      plugins: [
        replace({
          'csv-parse/sync': 'csv-parse/browser/esm/sync'
        })
      ]
    }
  ],
  plugins: [
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**' // only transpile our source code
    }),
    // jsx( { factory: "React.createElement" } ),
    // nodeResolve(),
    commonjs(),
    builtins()
  ]
};
