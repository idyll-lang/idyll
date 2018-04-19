const p = require('path')

const Papa = require('papaparse');
const slash = require('slash');

const errors = require('../errors.js');
var debug = require('debug')('idyll:cli');

class DataResolver {
  constructor(options, paths) {
    this.paths = paths
  }

  resolve(name, source) {
    debug(`Resolving data with name ${name} and source ${source}`);

    if (name[0] !== 'value') {
      throw new errors.UnsupportedDataTypeError(name[0]);
    }
    if (source[0] !== 'value') {
      throw new errors.UnsupportedDataTypeError(source[0]);
    }

    name = name[1];
    source = source[1];

    var data = null;

    if (source.endsWith('.csv')) {
      debug(`Loading ${source} as a CSV into data variable ${name}`);
      data = Papa.parse(slash(p.join(this.paths.DATA_DIR, source)), { header: true }).data;
    } else if (source.endsWith('.json')) {
      debug(`Loading ${source} as a JSON document into data variable ${name}`);
      data = require(slash(p.join(this.paths.DATA_DIR, source)));
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
