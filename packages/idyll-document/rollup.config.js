import commonjs from '@rollup/plugin-commonjs';
import jsx from 'rollup-plugin-jsx';
import replace from '@rollup/plugin-replace';
import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
      name: 'idyll-document'
      // plugins: [
      //   replace({
      //     'CSV_LIB': "csv-parse/sync"
      //   })
      // ]
    },
    {
      file: 'dist/esm/index.mjs',
      format: 'esm',
      // sourcemap: true
      plugins: [
        replace({
          'csv-parse/sync': 'csv-parse/browser/esm/sync'
        })
      ]
    }
  ],
  plugins: [
    babel({
      // babelrc: false is needed to prevent reading broken .babelrc files from
      // dependencies (we have to process node_modules). Thats why we also need
      // to inline our own .babelrc file
      // babelrc: false,
      babelHelpers: 'runtime',
      exclude: 'node_modules/**' // only transpile our source code
      // presets: ["@babel/preset-env", "@babel/preset-react"]
    }),
    // jsx( { factory: "React.createElement" } ),
    commonjs()
  ]
};
