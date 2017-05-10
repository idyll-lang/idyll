'use strict';

var test = require('tap').test

var findShip = require('../')
  , path = require('path');

test('\nfinding ship starting at lowest dir, looking for dependency unodep', function (t) {
  
  findShip(
      path.join(__dirname, 'uno', 'dos', 'tres')
    , function ismothership (pack) {
        return !!(pack.dependencies && pack.dependencies.unodep);
      }
    , function (err, res) {
        if (err) { t.fail(err); return t.end(); }
        t.equal(res.path, path.join(__dirname, 'uno', 'package.json'), 'resolves correct package.json path')
        t.equal(res.pack.name, 'uno', 'resolves correct package.json')
        t.end();
    }
  )
})

test('\nfinding ship starting at lowest dir, looking for dependency tresdep', function (t) {
  
  findShip(
      path.join(__dirname, 'uno', 'dos', 'tres')
    , function ismothership (pack) {
        return !!(pack.dependencies && pack.dependencies.tresdep);
      }
    , function (err, res) {
        if (err) { t.fail(err); return t.end(); }
        t.equal(res.path, path.join(__dirname, 'uno', 'dos', 'tres', 'package.json'), 'resolves correct package.json path')
        t.equal(res.pack.name, 'tres', 'resolves correct package.json')
        t.end();
    }
  )
})

test('\nfinding ship starting at lowest dir, looking for name dos', function (t) {
  findShip(
      path.join(__dirname, 'uno', 'dos', 'tres')
    , function ismothership (pack) {
        return pack.name === 'dos';
      }
    , function (err, res) {
        if (err) { t.fail(err); return t.end(); }
        t.equal(res.path, path.join(__dirname, 'uno', 'dos', 'package.json'), 'resolves correct package.json path')
        t.equal(res.pack.name, 'dos', 'resolves correct package.json')
        t.end();
    }
  )
})

test('\nfinding ship starting at lowest dir, looking for name cuatro - which does not exist', function (t) {
  findShip(
      path.join(__dirname, 'uno', 'dos', 'tres')
    , function ismothership (pack) {
        return pack.name === 'cuatro';
      }
    , function (err, res) {
        if (err) { t.fail(err); return t.end(); }
        t.notOk(res, 'finds no mother ship')
        t.end();
    }
  )
})
