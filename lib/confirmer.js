/**
 * Module dependencies.
 */
var DOMParser = require('xmldom').DOMParser
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
  
  // TODO: Parse Subject
  
  var els = $(xml).children('Subject', 'urn:oasis:names:tc:SAML:2.0:assertion')
                  .children('SubjectConfirmation', 'urn:oasis:names:tc:SAML:2.0:assertion');
  
  var methods = this._methods
    , method
    , el
    , conf;
  function next(err, ok) {
    if (err || ok) { return cb(err, ok); }
    
    el = (el ? el.next() : els.first());
    if (el.length == 0) { return cb(null, false); }
    
    method = el.attr('Method');
    conf = methods[method];
    if (!conf) { return next(); }
    conf(el, next);
  }
  next();
}

module.exports = Confirmer;
