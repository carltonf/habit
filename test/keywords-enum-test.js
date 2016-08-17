var expect = require('chai').expect;

var keywordsEnum = require('../src/keywords-enum');

describe ('keywords-enum', () => {
  it('works', () => {
    expect(keywordsEnum.HABIT).to.equal('habit');
    expect(keywordsEnum.STATE).to.equal('state');
    expect(keywordsEnum.DESCRIPTION).to.equal('description');
  });
});
