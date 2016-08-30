var expect = require('chai').expect;

var updateHeader = require('../../src/yaml/update');

describe('yaml/update', () => {
  var val = '2008-08-08';
  var line = 'last_modified_at: 2016-08-30';
  var expected = 'last_modified_at: 2008-08-08';

  it('works', () => {
    expect( updateHeader(line, val) ).to.equal( expected );
  });

  it ('fail on invalid input', () => {
    expect( () => { updateHeader('This is invalid line') } )
      .to.throw(SyntaxError, /not contain valid key/);
  });
});
