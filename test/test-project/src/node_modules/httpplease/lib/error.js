'use strict';

var Response = require('./response');
var extractResponseProps = require('./utils/extractResponseProps');
var extend = require('xtend');

function RequestError(message, props) {
  var err = new Error(message);
  err.name = 'RequestError';
  this.name = err.name;
  this.message = err.message;
  if (err.stack) {
    this.stack = err.stack;
  }

  this.toString = function() {
    return this.message;
  };

  for (var k in props) {
    if (props.hasOwnProperty(k)) {
      this[k] = props[k];
    }
  }
}

RequestError.prototype = extend(Error.prototype);
RequestError.prototype.constructor = RequestError;

RequestError.create = function(message, req, props) {
  var err = new RequestError(message, props);
  Response.call(err, extractResponseProps(req));
  return err;
};

module.exports = RequestError;
