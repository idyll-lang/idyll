var findRoot = require('find-root'),
    path = require('path'),
    through2 = require('through2');

function versionify(file, options) {

    options = options || {};
    var filter = options.filter;

    if (filter && !filter.test(file)) {
        return through2();
    }
    
    var placeholder = options.placeholder || '__VERSION__',
        re = new RegExp(placeholder, 'g'),
        version = options.version ||
            require(path.join(findRoot(file), 'package.json')).version;
    
    return through2({objectMode: true}, function(chunk, encoding, callback) {
        return callback(null, chunk.toString().replace(re, version));
    });
}

versionify.configure = function(options) {
    return function(file) {
        return versionify(file, options);
    };
};

module.exports = versionify;
