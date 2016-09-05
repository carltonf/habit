var expect = require('chai').expect;

var getLongDateStr = require('../../src/date/getLongDateStr');

describe('date/getLongDateStr', () => {
  var longDateStr = '2016-08-08';
  var date = new Date(longDateStr);

  it('works', () => {
    expect( getLongDateStr(date) ).to.equal(longDateStr);
  });
});
