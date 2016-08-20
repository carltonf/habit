const StatusAction = require('../../src/subcmd/status-action');
var expect = require('chai').expect;

describe('StatusAction', () => {
  var action;
  var expected;
  var res;

  describe('new', () => {
    it('throws error if postPath is unset', () => {
      expect( () => { new StatusAction(null) } )
        .to.throw(Error, /CWP is not set/);
    });
  });

  describe('.getStatus()', () => {
    const postPath = 'my-post.md';
    var opts = {};
    beforeEach(() => {
      action = new StatusAction(postPath);

      action.__getStatusStr = () => 'my-post status str';
      action.__getStatusJSON = () => {
        return {
          stage: 'post',
          title_abbr: 'my post',
          state: 'reviewing',
          description: 'really awesome addition',
        };
      };
    });

    it('works without options', () => {
      expected = 'my-post status str';
      res = action.getStatus();

      expect(res).to.equal(expected);
    });

    it('works with options', () => {
      opts = { stage: true, state: true, title_abbr: undefined, };
      expected = JSON.stringify({ stage: 'post', state: 'reviewing', });

      res = action.getStatus(opts);

      expect(res).to.equal(expected);
    });
  });

});
