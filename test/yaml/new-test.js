var expect = require('chai').expect;

var newHeader = require('../../src/yaml/new');

describe('yaml/new', () => {
  var date = new Date('2016-08-30');
  var title = 'my awesome post';

  var expected = [
    '---',
    'layout: post',
    'title: "my awesome post"',
    'date: 2016-08-30',
    'last_modified_at: 2016-08-30',
    'tags:',
    '- default',
    '---',
    '',
  ].join('\n');

  it('works', () => {
    expect( newHeader(title, date) ).to.equal(expected);
  });

  it('fail if title is missing', () => {
    expect( () => { newHeader(); } ).
      to.throw(SyntaxError, /title is not set/i);
  })
});
