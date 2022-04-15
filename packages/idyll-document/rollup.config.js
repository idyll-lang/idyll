import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { babel } from '@rollup/plugin-babel';

const pkg = require('./package.json');
const dependencies = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];

export default [
  {
    input: 'src/index.js',
    external: [/@babel\/runtime/, /csv-parse\/sync/, ...dependencies],
    onwarn: function(warning, warn) {
      if (warning.code === 'EVAL') return;
      warn(warning);
    },
    output: [
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
        name: 'idyll-document',
        exports: 'auto'
      }
    ],
    plugins: [
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**' // only transpile our source code
      }),
      // jsx( { factory: "React.createElement" } ),
      // nodeResolve(),
      commonjs()
    ]
  },
  {
    input: 'src/index.js',
    external: [
      /@babel\/runtime/,
      /csv-parse\/browser\/esm\/sync/,
      ...dependencies
    ],
    onwarn: function(warning, warn) {
      if (warning.code === 'EVAL') return;
      warn(warning);
    },
    output: [
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
      replace({
        values: {
          'csv-parse/sync': 'csv-parse/browser/esm/sync'
        },
        preventAssignment: true
      }),
      // jsx( { factory: "React.createElement" } ),
      // nodeResolve(),
      commonjs()
    ]
  }
];
