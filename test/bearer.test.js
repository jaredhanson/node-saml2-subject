var subject = require('index')
  , fs = require('fs');

describe('Bearer confirmation method', function() {
  
  var confirmer = new subject.Confirmer();
  confirmer.use('urn:oasis:names:tc:SAML:2.0:cm:bearer', subject.methods.bearer(function(recipient, irt, done) {
    if (recipient == 'http://lucy.localtunnel.me/login/SAML2/POST' &&
        irt == '_eyseyyR7kTUe3pTQIQVJkPxZcf1KBuwh') {
      return done(null, true);
    }
    return done(null, false);
  }));
  
  describe('confirming data with expected values', function() {
    var xml = fs.readFileSync(__dirname + '/data/bearer-no-expiry.xml', 'utf8');
    
    it('should be confirmed', function(done) {
      confirmer.confirm(xml, function(err, ok) {
        if (err) return done(err);
        expect(ok).to.be.true;
        done();
      });
    });
  });
  
  describe('confirming data with unexpected values', function() {
    var xml = fs.readFileSync(__dirname + '/data/bearer-wrong-recipient.xml', 'utf8');
    
    it('should be confirmed', function(done) {
      confirmer.confirm(xml, function(err, ok) {
        if (err) return done(err);
        expect(ok).to.be.false;
        done();
      });
    });
  });
    
  describe('confirming expired data', function() {
    var xml = fs.readFileSync(__dirname + '/data/bearer-expired.xml', 'utf8');
    
    it('should not be confirmed', function(done) {
      confirmer.confirm(xml, function(err, ok) {
        if (err) return done(err);
        expect(ok).to.be.false;
        done();
      });
    });
  });
  
});
