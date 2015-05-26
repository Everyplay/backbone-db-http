var _ = require('lodash');
var BackboneDb = require('backbone-db');
var debug = require('debug')('backbone-db-http');
var request = require('request');
var when = require('when');

var _request = function(opts) {
  if (!opts.url) {
    return when.reject(new Error('No url specified'));
  }
  var requestOptions = _.extend(
    {
      method: 'GET',
      json: true
    },
    opts
  );
  debug('request %s %s', requestOptions.method, requestOptions.url);
  return when.promise(function(resolve, reject) {
    var handleResponse = function(err, response) {
      if (err || !response) {
        return reject(err || new Error('no response'));
      }
      return resolve(response.body);
    };
    request(requestOptions, handleResponse);
  });
};

function HttpDb(name, options) {
  this.options = options || {};
  this.name = name;
  this.request = _request;
}

HttpDb.sync = BackboneDb.sync;

_.extend(HttpDb.prototype, BackboneDb.prototype, {
  createUrl: function(model) {
    var base = '';
    if (this.options.base_url) {
      base = this.options.base_url;
    }
    return base + model.url();
  },
  find: function(model, options, cb) {
    var requestOptions = {
      url: this.createUrl(model)
    };
    debug('find model: %o (%o)', model.toJSON(), requestOptions);
    this.request(requestOptions)
      .then(function(response) {
        cb(null, response);
      }, function(err) {
        cb(err);
      });
  }
});

module.exports = HttpDb;
