const { join } = require('path');
const slash = require('slash');
const fs = require('fs');

const parse = require('csv-parse/lib/sync');

const errors = require('../errors.js');
var debug = require('debug')('idyll:cli');

class DataResolver {
  constructor(options, paths) {
    this.paths = paths;
  }

  resolve(name, source, async) {
    debug(`Resolving data with name ${name} and source ${source}`);

    if (name.type !== 'value') {
      throw new errors.UnsupportedDataTypeError(name[0]);
    }
    if (source.type !== 'value') {
      throw new errors.UnsupportedDataTypeError(source[0]);
    }

    name = name.value;
    source = source.value;
    async = async ? async.value : false;
    var data = null;
    if (async) {
      data = [];
    } else if (source.endsWith('.csv')) {
      debug(`Loading ${source} as a CSV into data variable ${name}`);
      const inputString = fs.readFileSync(
        slash(join(this.paths.DATA_DIR, source))
      );
      data = parse(inputString, {
        cast: true,
        columns: true,
        skip_empty_lines: true,
        ltrim: true,
        rtrim: true
      });
      debug(`${JSON.stringify(data)}`);
    } else if (source.endsWith('.json')) {
      debug(`Loading ${source} as a JSON document into data variable ${name}`);
      data = require(slash(join(this.paths.DATA_DIR, source)));
    } else {
      throw new errors.UnknownDataError(source);
    }

    return {
      resolvedName: name,
      data
    };
  }

  getDirectories() {
    return [this.paths.DATA_DIR];
  }
}

module.exports.DataResolver = DataResolver;
