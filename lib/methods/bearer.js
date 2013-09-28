/**
 * Module dependencies.
 */
var moment = require('moment');


/**
 * Confirms the validity of a subject using the bearer method.
 *
 * For details regarding this confirmation method, refer to SAML Profiles,
 * section 3.3.
 *
 * References:
 *   - [Profiles for the OASIS Security Assertion Markup Language (SAML) V2.0](http://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)
 *
 * @param {Object} options
 * @param {Function} confirm
 * @return {Function}
 * @api public
 */
module.exports = function(options) {
  options = options || {};
  
  return function(conf, done) {
    var now = moment();
    
    var data = conf.children('SubjectConfirmationData', 'urn:oasis:names:tc:SAML:2.0:assertion');
    var nooa = data.attr('NotOnOrAfter');
    if (nooa) {
      var ends = moment.utc(nooa, 'YYYY-MM-DDTHH:mm:ss');
      if (now.isAfter(ends) || now.isSame(ends)) { return done(null, false, { reason: 'Subject can no longer be confirmed.' }); }
    }
    var nb = data.attr('NotBefore');
    if (nb) {
      var begins = moment.utc(nb, 'YYYY-MM-DDTHH:mm:ss');
      if (now.isBefore(begins)) { return done(null, false, { reason: 'Subject cannot yet be confirmed.' }); }
    }
    
    var recipient = data.attr('Recipient')
      , irt = data.attr('InResponseTo')
      , ip = data.attr('Address');
    
    if (options.recipient) {
      if (options.recipient != recipient) { return done(null, false, { reason: 'Subject presented assertion to wrong recipient.' }); }
    }
    if (options.inResponseTo) {
      if (options.inResponseTo != irt) { return done(null, false, { reason: 'Subject presented assertion in response to incorrect request.' }); }
    }
    
    return done(null, true);
  }
}
