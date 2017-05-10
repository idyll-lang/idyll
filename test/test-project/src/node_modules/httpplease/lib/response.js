'use strict';

var Request = require('./request');
var extractResponseProps = require('./utils/extractResponseProps');

function Response(props) {
  this.request = props.request;
  this.xhr = props.xhr;
  this.headers = props.headers || {};
  this.status = props.status || 0;
  this.text = props.text;
  this.body = props.body;
  this.contentType = props.contentType;
  this.isHttpError = props.status >= 400;
}

Response.prototype.header = Request.prototype.header;

Response.fromRequest = function(req) {
  return new Response(extractResponseProps(req));
};


module.exports = Response;
