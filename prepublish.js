const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const babelify = require('babelify');
const reactPreset = require('babel-preset-react');
const es2015Preset = require('babel-preset-es2015');
const brfs = require('brfs');

const componentsDir = path.join(__dirname, 'components');
const libDir = path.join(__dirname, 'lib');

if (!fs.existsSync(libDir)) fs.mkdirSync(libDir);

fs.readdirSync(componentsDir).forEach((file) => {
  if (!file.endsWith('.js')) return;

  const b = browserify({
    entries: [path.join(componentsDir, file)],
    transform: [
      [ babelify, { presets: [ reactPreset, es2015Preset ] } ],
      [ brfs ]
    ]
  });
  b.external([ 'react', 'react-dom' ]);
  b.bundle().pipe(fs.createWriteStream(path.join(libDir, file)));
})
