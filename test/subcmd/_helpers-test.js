const helpers = require('../../src/subcmd/_helpers');
var expect = require('chai').expect;

describe('helpers', () => {
  describe('.parseFieldsFromOpts', () => {
    var opts = {};
    var fieldKeys = [];
    var expected = [];
    var res = [];

    beforeEach(() => {
      opts = {
        a: 1, b:2, c:3, d:4
      };
      fieldKeys = ['b', 'c', 'x'];

      expected = ['b', 'c'];
    });

    it('works without desc', () => {
      res = helpers.parseFieldsFromOpts(opts, fieldKeys);

      expect(res).to.deep.equal(expected);
    });

    it('works with desc translated to description', () => {
      opts.desc = true;
      fieldKeys.push('desc');
      expected.push('description');

      res = helpers.parseFieldsFromOpts(opts, fieldKeys);

      expect(res).to.deep.equal(expected);
    });
  });

  describe('.getCWP', () => {
    const CWP_ENV = helpers.CWP_ENV;
    var expected = 'my-cwp';
    var cwp = '';

    it('works', () => {
      process.env[CWP_ENV] = expected;
      cwp = helpers.getCWP();

      expect(cwp).to.equal(expected);
    });

    it('returns null when not set', () => {
      delete process.env[CWP_ENV];
      cwp = helpers.getCWP();

      expect(cwp).to.equal(null);
    });
  });

  describe('.assertPostPath', () => {
    it('works', () => {
      expect( () => helpers.assertPostPath(null) )
        .to.throw(Error, /not set/);
    });
  });
});
