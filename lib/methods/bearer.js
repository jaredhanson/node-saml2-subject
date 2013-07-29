/**
 * Module dependencies.
 */
var moment = require('moment');


module.exports = function(options, confirm) {
  if (typeof options == 'function') {
    confirm = options;
    options = undefined;
  }
  options = options || {};
  
  return function(conf, done) {
    var now = moment();
    
    var data = conf.children('SubjectConfirmationData', 'urn:oasis:names:tc:SAML:2.0:assertion');
    var nooa = data.attr('NotOnOrAfter');
    if (nooa) {
      var ended = moment.utc(nooa, 'YYYY-MM-DDTHH:mm:ss');
      if (now.isAfter(ended) || now.isSame(ended)) { return done(null, false); }
    }
    
    var recipient = data.attr('Recipient')
      , irt = data.attr('InResponseTo')
      , ip = data.attr('Address');
      
    function confirmed(err, ok) {
      if (err) { return done(err); }
      return done(null, ok);
    }
    
    var arity = confirm.length;
    if (arity == 4) {
      confirm(recipient, irt, ip, confirmed);
    } else { // arity == 3
      confirm(recipient, irt, confirmed);
    }
  }
}
