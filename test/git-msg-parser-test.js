var expect = require('chai').expect
var parser = require('../src/git/msg-parser');
var K = require('../src/keywords-enum');

describe('git/msg-parser', () => {

  describe('parse', () => {
    var msg;
    var expected_json;
    beforeEach(() => {
      // NOTE clear up stage to avoid residual pollution
      msg = '';
      expected_json = {};
    });

    describe('works on valid input like', () => {
      it('basic msg', () => {
        msg =
`${K.HABIT}(post): my awesome post

* ${K.STATE}: polishing
`;

        expected_json = {
          title_abbr: 'my awesome post',
          stage: 'post',
          state: 'polishing',
        };

        expect( parser.parse(msg) ).to.deep.equal( expected_json );
      });

      it('basic msg with extra whitespace', () => {
        // NOTE 'state:' is followed by tab and whitespace
        msg =
`${K.HABIT}(post):          my awesome post     

* ${K.STATE}:	 polishing
`;

        expected_json = {
          title_abbr: 'my awesome post',
          stage: 'post',
          state: 'polishing',
        };

        expect( parser.parse(msg) ).to.deep.equal( expected_json );
      });

      it ('basic msg with percent', () => {
        msg =
`${K.HABIT}(post): my awesome post

* ${K.STATE}: polishing 70%
`;

        expected_json = {
          title_abbr: 'my awesome post',
          stage: 'post',
          state: 'polishing',
          state_percent: '70%',
        };

        expect( parser.parse(msg) ).to.deep.equal( expected_json );
      });

      it ('full msg', () => {
        msg =
`${K.HABIT}(post): my awesome post

* ${K.STATE}: polishing 70%
* ${K.DESCRIPTION}: awesome editing
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

      it ('full msg with different paragrahs', () => {
        msg =
`${K.HABIT}(post): my awesome post
* ${K.STATE}: polishing 70%

* ${K.DESCRIPTION}: awesome editing
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

      it ('full msg with punctuations in description', () => {
        msg =
`${K.HABIT}(post): my awesome post

* ${K.STATE}: polishing 70%
* ${K.DESCRIPTION}: awesome editing!
`;

        expected_json = {
          title_abbr: 'my awesome post',
          stage: 'post',
          state: 'polishing',
          state_percent: '70%',
          description: 'awesome editing!',
        };

        expect( parser.parse(msg) ).to.deep.equal( expected_json );
      });

    });

    describe('returns null on invalid msg', () => {
      function expectParseToReturnNull (msg) {
        expect( parser.parse(msg) ).to.equal(null);
      }

      before(() => {
        expected_json = null;
      });

      it ('that is empty', () => {
        msg = '';

        expectParseToReturnNull(msg);
      });

      it ('that lacks some field', () => {
        msg = `${K.HABIT}(post): my awesome post`;

        expectParseToReturnNull(msg);
      });

      it ('that is syntax-wise correct but semantically wrong', () => {
        msg =
`${K.HABIT}(post): my awesome post

* ${K.STATE}: wrong-state 70%
* ${K.DESCRIPTION}: awesome editing
`;

        expectParseToReturnNull(msg);
      });
    });

  });

  // NOTE: RegExp looks small, but requires good testing.
  describe('HEADER_PAT',  () => {
    var header;
    beforeEach(() => {
      header = "";
    });

    it ('match normal string', () => {
      header = `${K.HABIT}(post): my awesome post`;

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
      header = `${K.HABIT}(post): a`;

      let match_data = header.match(parser.HEADER_PAT);
      expect(match_data).not.to.equal(null);
      let [_, stage, title_abbr] = match_data;
      expect(stage).to.equal('post');
      expect(title_abbr).to.equal('a');
    });

    it ("do NOT match empty-title header", () => {
      header = "${K.HABIT}(post): ";

      let match_data = header.match(parser.HEADER_PAT);
      expect(match_data).to.equal(null);
    });
  });
});
