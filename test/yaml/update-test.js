var expect = require('chai').expect;

var updateHeader = require('../../src/yaml/update');

describe('yaml/update', () => {
  var val = '2008-08-08';
  var line = 'last_modified_at: 2016-08-30';
  var key = 'last_modified_at';
  var expected = 'last_modified_at: 2008-08-08';

  it('works', () => {
    expect( updateHeader(line, val) ).to.equal( expected );
  });

  it ('works with key', () => {
    expect( updateHeader(line, val, key) ).to.equal( expected );
  });

  it ('works with wrong key', () => {
    key = 'date';
    expect( updateHeader(line, val, key) ).to.equal( line );
  });

  it ('fail on invalid input', () => {
    expect( () => { updateHeader('This is invalid line') } )
      .to.throw(SyntaxError, /not contain valid key/);
  });
});
