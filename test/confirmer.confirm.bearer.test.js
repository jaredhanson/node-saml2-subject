var subject = require('index')
  , fs = require('fs');

describe('subject confirmation using bearer method', function() {
  
  describe('with valid data', function() {
    var xml = fs.readFileSync(__dirname + '/data/Bearer.xml', 'utf8');
  
    describe('confirming subject without checking recipient or bearer', function() {
      var confirmer = new subject.Confirmer();
      confirmer.use('urn:oasis:names:tc:SAML:2.0:cm:bearer', subject.methods.bearer());
    
      it('should be confirmed', function(done) {
        confirmer.confirm(xml, function(err, ok, sub) {
          if (err) return done(err);
          expect(ok).to.be.true;
          expect(sub).to.be.an('object');
          expect(sub.format).to.equal('transient');
          expect(sub.id).to.equal('_00000000aaa0a0a00a000aa0a00aa00aa000a000a0');
          done();
        });
      });
    });
  
    describe('confirming subject and checking recipient', function() {
      var confirmer = new subject.Confirmer();
      confirmer.use('urn:oasis:names:tc:SAML:2.0:cm:bearer', subject.methods.bearer({ recipient: 'http://lucy.localtunnel.me/login/SAML2/POST' }));
    
      it('should be confirmed', function(done) {
        confirmer.confirm(xml, function(err, ok, sub) {
          if (err) return done(err);
          expect(ok).to.be.true;
          expect(sub).to.be.an('object');
          expect(sub.format).to.equal('transient');
          expect(sub.id).to.equal('_00000000aaa0a0a00a000aa0a00aa00aa000a000a0');
          done();
        });
      });
    });
  
    describe('confirming subject and checking in response to', function() {
      var confirmer = new subject.Confirmer();
      confirmer.use('urn:oasis:names:tc:SAML:2.0:cm:bearer', subject.methods.bearer({ inResponseTo: '_eyseyyR7kTUe3pTQIQVJkPxZcf1KBuwh' }));
    
      it('should be confirmed', function(done) {
        confirmer.confirm(xml, function(err, ok, sub) {
          if (err) return done(err);
          expect(ok).to.be.true;
          expect(sub).to.be.an('object');
          expect(sub.format).to.equal('transient');
          expect(sub.id).to.equal('_00000000aaa0a0a00a000aa0a00aa00aa000a000a0');
          done();
        });
      });
    });
  
    describe('disconfirming subject due to wrong recipient', function() {
      var confirmer = new subject.Confirmer();
      confirmer.use('urn:oasis:names:tc:SAML:2.0:cm:bearer', subject.methods.bearer({ recipient: 'http://NOT.localtunnel.me/login/SAML2/POST' }));
    
      it('should not be confirmed', function(done) {
        confirmer.confirm(xml, function(err, ok, info) {
          if (err) return done(err);
          expect(ok).to.be.false;
          expect(info).to.be.an('object');
          expect(info.reason).to.equal('Subject presented assertion to wrong recipient.');
          done();
        });
      });
    });
  
    describe('disconfirming subject due to wrong in response to', function() {
      var confirmer = new subject.Confirmer();
      confirmer.use('urn:oasis:names:tc:SAML:2.0:cm:bearer', subject.methods.bearer({ inResponseTo: '0' }));
    
      it('should not be confirmed', function(done) {
        confirmer.confirm(xml, function(err, ok, info) {
          if (err) return done(err);
          expect(ok).to.be.false;
          expect(info).to.be.an('object');
          expect(info.reason).to.equal('Subject presented assertion in response to incorrect request.');
          done();
        });
      });
    });
    
  });
  
  describe('with expired data', function() {
    var xml = fs.readFileSync(__dirname + '/data/BearerThatHasExpired.xml', 'utf8');
    
    describe('disconfirming subject', function() {
      var confirmer = new subject.Confirmer();
      confirmer.use('urn:oasis:names:tc:SAML:2.0:cm:bearer', subject.methods.bearer());
    
      it('should not be confirmed', function(done) {
        confirmer.confirm(xml, function(err, ok, info) {
          if (err) return done(err);
          expect(ok).to.be.false;
          expect(info).to.be.an('object');
          expect(info.reason).to.equal('Subject can no longer be confirmed.');
          done();
        });
      });
    });
  });
  
  describe('with not yet active data', function() {
    var xml = fs.readFileSync(__dirname + '/data/BearerThatIsNotYetActive.xml', 'utf8');
    
    describe('disconfirming subject', function() {
      var confirmer = new subject.Confirmer();
      confirmer.use('urn:oasis:names:tc:SAML:2.0:cm:bearer', subject.methods.bearer());
    
      it('should not be confirmed', function(done) {
        confirmer.confirm(xml, function(err, ok, info) {
          if (err) return done(err);
          expect(ok).to.be.false;
          expect(info).to.be.an('object');
          expect(info.reason).to.equal('Subject cannot yet be confirmed.');
          done();
        });
      });
    });
  });
  
});
