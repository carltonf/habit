const CommitAction = require('../../src/subcmd/commit-action');
var expect = require('chai').expect;

describe('CommitAction', () => {
  var POST_PATH = 'my-post.md';
  var action = null;
  var expected = null;
  var res = undefined;

  describe('._updateFieldsFromOpts()', () => {
    beforeEach(() => {
      // NOTE stub
      CommitAction.prototype.__canCommit = () => true;
      CommitAction.prototype.__getStatusJSON = () => {
        return {};
      };

      action = new CommitAction(POST_PATH);
    });

    it('works for description', () => {
      let opts = { 'desc': 'new desc' };
      let expected = { 'description': 'new desc' };
      let json = {};

      res = action._updateFieldsFromOpts(json, opts);
      expect(res).to.deep.equal(expected);
    });
  });
});
