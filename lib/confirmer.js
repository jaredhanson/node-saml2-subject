/**
 * Module dependencies.
 */
var nameid = require('saml2-nameid')
  , DOMParser = require('xmldom').DOMParser
  , $ = require('xtraverse');


function Confirmer() {
  this._methods = {};
}

Confirmer.prototype.use = function(method, fn) {
  this._methods[method] = fn;
}

Confirmer.prototype.confirm = function(xml, cb) {
  if (typeof xml === 'string') {
    xml = new DOMParser().parseFromString(xml);
  }
  
  var subject = $(xml).children('Subject', 'urn:oasis:names:tc:SAML:2.0:assertion')
    , nid = subject.children('NameID', 'urn:oasis:names:tc:SAML:2.0:assertion')
    , confs = subject.children('SubjectConfirmation', 'urn:oasis:names:tc:SAML:2.0:assertion')
    , sub = nameid.parse(nid)
    , methods = this._methods
    , method
    , conf
    , fn;
  function next(err, ok) {
    if (err || ok) { return cb(err, ok, sub); }
    
    conf = (conf ? conf.next() : confs.first());
    if (conf.length == 0) { return cb(null, false); }
    
    method = conf.attr('Method');
    fn = methods[method];
    if (!fn) { return next(); }
    fn(conf, next);
  }
  next();
}

module.exports = Confirmer;
