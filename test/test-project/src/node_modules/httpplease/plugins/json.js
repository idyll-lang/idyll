'use strict';

var jsonrequest = require('./jsonrequest'),
    jsonresponse = require('./jsonresponse');

module.exports = {
  processRequest: function(req) {
    jsonrequest.processRequest.call(this, req);
    jsonresponse.processRequest.call(this, req);
  },
  processResponse: function(res) {
    jsonresponse.processResponse.call(this, res);
  }
};
