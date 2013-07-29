var subject = require('index');

describe('saml2-subject', function() {
  
  it('should export Confirmer constructor', function() {
    expect(subject.Confirmer).to.be.a('function');
  });
  
});
