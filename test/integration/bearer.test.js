var subject = require('index')
  , fs = require('fs');

describe('subject confirmation with bearer method', function() {
  
  var confirmer = new subject.Confirmer();
  confirmer.use('urn:oasis:names:tc:SAML:2.0:cm:bearer', subject.methods.bearer(function(recipient, irt, done) {
    if (recipient == 'http://lucy.localtunnel.me/login/SAML2/POST' &&
        irt == '_eyseyyR7kTUe3pTQIQVJkPxZcf1KBuwh') {
      return done(null, true);
    }
    return done(null, false);
  }));
  
  describe('confirming assertion with expected values', function() {
    var xml = fs.readFileSync(__dirname + '/../data/Bearer.xml', 'utf8');
    
    it('should be confirmed', function(done) {
      confirmer.confirm(xml, function(err, ok) {
        if (err) return done(err);
        expect(ok).to.be.true;
        done();
      });
    });
  });
  
  describe('confirming assertion with wrong recipient', function() {
    var xml = fs.readFileSync(__dirname + '/../data/BearerWithWrongRecipient.xml', 'utf8');
    
    it('should not be confirmed', function(done) {
      confirmer.confirm(xml, function(err, ok) {
        if (err) return done(err);
        expect(ok).to.be.false;
        done();
      });
    });
  });
    
  describe('confirming assertion that has expired', function() {
    var xml = fs.readFileSync(__dirname + '/../data/BearerThatHasExpired.xml', 'utf8');
    
    it('should not be confirmed', function(done) {
      confirmer.confirm(xml, function(err, ok) {
        if (err) return done(err);
        expect(ok).to.be.false;
        done();
      });
    });
  });
  
});

describe('subject confirmation with bearer method using address', function() {
  
  var confirmer = new subject.Confirmer();
  confirmer.use('urn:oasis:names:tc:SAML:2.0:cm:bearer', subject.methods.bearer(function(recipient, irt, ip, done) {
    if (recipient == 'http://lucy.localtunnel.me/login/SAML2/POST' &&
        irt == '_eyseyyR7kTUe3pTQIQVJkPxZcf1KBuwh' &&
        ip == '1.2.3.4') {
      return done(null, true);
    }
    return done(null, false);
  }));
  
  describe('confirming assertion with expected values', function() {
    var xml = fs.readFileSync(__dirname + '/../data/BearerWithAddress.xml', 'utf8');
    
    it('should be confirmed', function(done) {
      confirmer.confirm(xml, function(err, ok) {
        if (err) return done(err);
        expect(ok).to.be.true;
        done();
      });
    });
  });
  
});

describe('subject confirmation with bearer method that encounters an error', function() {
  
  var confirmer = new subject.Confirmer();
  confirmer.use('urn:oasis:names:tc:SAML:2.0:cm:bearer', subject.methods.bearer(function(recipient, irt, done) {
    return done(new Error('something went wrong'))
  }));
  
  describe('confirming assertion with expected values', function() {
    var xml = fs.readFileSync(__dirname + '/../data/Bearer.xml', 'utf8');
    
    it('should be confirmed', function(done) {
      confirmer.confirm(xml, function(err, ok) {
        expect(err).to.be.instanceof(Error);
        expect(ok).to.be.undefined;
        done();
      });
    });
  });
  
});

