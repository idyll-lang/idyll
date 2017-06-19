const fs = require('fs');
const { join } = require('path');
const b = require('browserify')();

b.require(join(
  __dirname,
  '..',
  'node_modules',
  'react',
  'dist',
  'react.min.js'
), { expose: 'react' });

b.require(join(
  __dirname,
  '..',
  'node_modules',
  'react-dom',
  'dist',
  'react-dom.min.js'
), { expose: 'react-dom' });

b.bundle().pipe(fs.createWriteStream(join(
  __dirname,
  '..',
  'src',
  'client',
  'assets',
  'libs.js'
)));
