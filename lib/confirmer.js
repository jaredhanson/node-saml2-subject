/**
 * Module dependencies.
 */
var DOMParser = require('xmldom').DOMParser
  , $ = require('xtraverse');


function Confirmer() {
  this._methods = {};
}

Confirmer.prototype.use = function(name, fn) {
  this._methods[name] = fn;
}

Confirmer.prototype.confirm = function(xml, cb) {
  if (typeof xml === 'string') {
    xml = new DOMParser().parseFromString(xml);
  }
  
  var confs = $(xml).children('Subject', 'urn:oasis:names:tc:SAML:2.0:assertion')
                    .children('SubjectConfirmation', 'urn:oasis:names:tc:SAML:2.0:assertion');
  for (var conf = confs.first(); conf.length > 0; conf = conf.next()) {
    console.log(conf.attr('Method'));
  }
}

module.exports = Confirmer;
