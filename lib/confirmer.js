/**
 * Module dependencies.
 */
var nameid = require('saml2-nameid')
  , X = require('xtraverse');


function Confirmer() {
  this._methods = {};
}

Confirmer.prototype.use = function(method, fn) {
  this._methods[method] = fn;
}

// SAML Core, section 2.4.1
Confirmer.prototype.confirm = function(xml, cb) {
  var subject = X(xml)
    , confs = subject.children('SubjectConfirmation', 'urn:oasis:names:tc:SAML:2.0:assertion')
    , methods = this._methods
    , method
    , conf
    , fn;
  function next(err, ok, info) {
    if (err || ok === false) { return cb(err, ok, info); }
    if (ok) {
      var nid, sub;
      try {
        nid = subject.children('NameID', 'urn:oasis:names:tc:SAML:2.0:assertion');
        sub = nameid.parse(nid);
      } catch (ex) {
        return cb(ex);
      }
      return cb(null, ok, sub);
    }
    
    conf = (conf ? conf.next('SubjectConfirmation', 'urn:oasis:names:tc:SAML:2.0:assertion') : confs.first());
    if (conf.length == 0) { return cb(null, false); }
    
    method = conf.attr('Method');
    fn = methods[method];
    if (!fn) { return next(); }
    fn(conf, next);
  }
  next();
}

module.exports = Confirmer;
