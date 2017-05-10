'use strict';

var findShip = require('../')
  , path = require('path');

findShip(
    path.join(__dirname, 'uno', 'dos', 'tres')
  , function ismothership (pack) {
      return !!(pack.dependencies && pack.dependencies.unodep);
    }
  , function (err, res) {
      if (err) return console.error(err);
      console.log('first mothership', res.path);  // => [..]/example/uno/package.json
  }
)

findShip(
    path.join(__dirname, 'uno', 'dos', 'tres')
  , function ismothership (pack) {
      return pack.name === 'dos';
    }
  , function (err, res) {
      if (err) return console.error(err);
      console.log('second mothership', res.path);  // => [..]/example/uno/dos/package.json
  }
)
