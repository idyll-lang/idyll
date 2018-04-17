const p = require('path')

const Papa = require('papaparse');
const slash = require('slash');

const errors = require('../errors.js');
const debug = require('debug')('idyll-cli');

class DataResolver {
  constructor(options, paths) {
    this.paths = paths
  }

  resolve(name, source) {
    if (source.endsWith('.csv')) {
      debug(`Loading ${source} as a CSV into data variable ${name}`)
      return Papa.parse(slash(p.join(this.paths.DATA_DIR, source)), { header: true }).data;
    } else if (source.endsWith('.json')) {
      debug(`Loading ${source} as a JSON document into data variable ${name}`)
      return require(slash(p.join(this.paths.DATA_DIR, source)));
    } else {
      throw new errors.UnknownDataError(source);
    }
  }

  getDirectories() {
    return [this.paths.DATA_DIR];
  }
}

module.exports.DataResolver = DataResolver
