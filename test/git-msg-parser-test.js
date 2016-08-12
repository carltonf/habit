var expect = require('chai').expect
var parser = require('../src/git-msg-parser');

describe('git-msg-parser', () => {

  describe('parse', () => {
    var msg;
    var expected_json;
    beforeEach(() => {
      // NOTE clear up stage to avoid residual pollution
      msg = '';
      expected_json = {};
    });

    it('works for basic msg', () => {
      msg =
`habit(post): my awesome post

* status: polishing
`;

      expected_json = {
        title_abbr: 'my awesome post',
        stage: 'post',
        state: 'polishing',
      };

      expect( parser.parse(msg) ).to.deep.equal( expected_json );
    });

    it ('works for basic msg with percent', () => {
      msg =
`habit(post): my awesome post

* status: polishing 70%
`;

      expected_json = {
        title_abbr: 'my awesome post',
        stage: 'post',
        state: 'polishing',
        state_percent: '70%',
      };

      expect( parser.parse(msg) ).to.deep.equal( expected_json );
    });

    it ('works for full msg', () => {
      msg =
`habit(post): my awesome post

* status: polishing 70%
* description: awesome editing
`;

      expected_json = {
        title_abbr: 'my awesome post',
        stage: 'post',
        state: 'polishing',
        state_percent: '70%',
        description: 'awesome editing',
      };

      expect( parser.parse(msg) ).to.deep.equal( expected_json );
    });
  });

  // RegExp looks small, but require good testing.
  describe('HEADER_PAT',  () => {
    var header;
    beforeEach(() => {
      header = "";
    });

    it ('match normal string', () => {
      header = "habit(post): my awesome post";

      expect(parser.HEADER_PAT).is.an.instanceof(RegExp);

      let match_data = header.match(parser.HEADER_PAT);

      // NOTE(learning): the following error is due to `match` call has returned
      // null **and** destructuring assignment requires some 'matching'.:
      //
      // TypeError: Cannot match against 'undefined' or 'null'
      // var [_, stage, title_abbr] = header.match(parser.HEADER_PAT);
      //
      // See: var [a] = null
      //
      // As a side note, if header is null/undefined, the error should be 'can
      // not read property from null/undefeined'. If 'parse.HEADER_PAT' is
      // null/undefined, no error is thrown, simply the call to 'match' returns
      // null.
      //
      // Nevertheless, I still think the phrasing is confusing here. As a rule
      // of thumb, matching and destructuring assignments are better left in
      // discrete statements.

      expect(match_data).not.to.equal(null);

      let [_, stage, title_abbr] = match_data;
      expect(stage).to.equal('post');
      expect(title_abbr).to.equal('my awesome post');
    });

    it ('match single-letter title', () => {
      // NOTE peculiar, but yet a supported edge case.
      header = "habit(post): a";

      let match_data = header.match(parser.HEADER_PAT);
      expect(match_data).not.to.equal(null);
      let [_, stage, title_abbr] = match_data;
      expect(stage).to.equal('post');
      expect(title_abbr).to.equal('a');
    });

    it ("do NOT match empty-title header", () => {
      header = "habit(post): ";

      let match_data = header.match(parser.HEADER_PAT);
      expect(match_data).to.equal(null);
    });
  });
});
