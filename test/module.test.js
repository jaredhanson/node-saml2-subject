var subject = require('index');

describe('saml2-subject', function() {
  
  it('should export Confirmer constructor', function() {
    expect(subject.Confirmer).to.be.a('function');
  });
  
  it('should export methods', function() {
    expect(Object.keys(subject.methods)).to.have.length(1);
    expect(subject.methods.bearer).to.be.a('function');
  });
  
});
