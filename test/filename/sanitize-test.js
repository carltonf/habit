var expect = require('chai').expect;

var fnSanitize = require('../../src/filename/sanitize');

describe('filename/sanitize', () => {
  var title = 'My Awesome Post: Great Day';
  var expected = 'my-awesome-post-great-day'

  it('works', () => {
    expect( fnSanitize(title) ).to.equal(expected);
  });

  it('fails on bad title', () => {
    expect( () => { fnSanitize('*&^%#$#'); } )
      .to.throw(SyntaxError, /not good for post/);
  });
});
