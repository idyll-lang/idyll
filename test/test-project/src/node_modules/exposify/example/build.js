'use strict';

var browserify = require('browserify')
  , path       = require('path')
  , fs         = require('fs')
  , exposify   = require('exposify')

// configure what we want to expose
exposify.config = { jquery: '$', three: 'THREE' };

browserify()
  .require(require.resolve('./main'), { entry: true })
  .transform(exposify)
  .bundle({ debug: true })
  .on('end', function () {
    console.log('all done, open index.html')
  })
  .pipe(fs.createWriteStream(path.join(__dirname, 'bundle.js'), 'utf8'))
