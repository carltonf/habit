var _json_data_validator = require('../src/git-msg-generator')._json_data_validator;
var git_msg_generate = require('../src/git-msg-generator').git_msg_generate;
var expect = require('chai').expect

describe('git-msg-generator', () => {
  describe('_json_data_validator', () => {
    var jsdata;

    // NOTE helper for test
    function expectToThrowSyntaxError(jsdata, msg_pat){
      expect(_json_data_validator.bind(null, jsdata))
        .to.throw(SyntaxError, msg_pat);
    }

    beforeEach(() =>{
      jsdata = {
        stage: 'draft',
        state: 'fledging',
        title_abbr: 'my awsome post',
        state_percent: '70%'
      };
    });

    it ('detect wrong stage', () => {
      jsdata.stage = 'nonexistent';

      expectToThrowSyntaxError(jsdata, /known stages/)
    });

    describe ('validate state', () => {

      it ('detect nonexistent state', () => {
        jsdata.state = 'nonexistent';

        expectToThrowSyntaxError(jsdata, /valid state/);
      });

      it ('detect wrong state', () => {
        jsdata.stage = 'post';
        jsdata.state = 'scaffolding';

        expectToThrowSyntaxError(jsdata, /valid state/);
      });
    });

    describe('validate title', () => {
      it ('detect empty title', () => {
        jsdata.title_abbr = '';

        expectToThrowSyntaxError(jsdata, /not be empty/);
      });

      it ('detect non-existent title', () => {
        delete jsdata.title_abbr;

        expectToThrowSyntaxError(jsdata, /nonexistent/);
      });
    });

    describe ('validate state_percent', () => {
      it ('detect wrong state_percent', () => {
        jsdata.state_percent = '34';

        expectToThrowSyntaxError(jsdata, /percent is not valid/);
      });

      it ('allow empty state_percent', () => {
        jsdata.state_percent = '';

        expect(_json_data_validator(jsdata)).is.true;
      });

      it ('allow non-existent state_percent', () => {
        delete jsdata.state_percent;

        expect(_json_data_validator(jsdata)).is.true;
      });
    });
  });

  describe('git_msg_generate', () => {
    var jsdata;

    it ('works', () => {
      jsdata = {
        title_abbr: 'my awesome post',
        stage: 'post',
        state: 'polishing',
        state_percent: '70%'
      };

      // NOTE use backtick here so we can easily write multi-line string
      var expected_msg =
`habit(post): my awesome post

* status: polishing 70%
`;

      expect(git_msg_generate(jsdata)).to.equal(expected_msg);
    });

  });
})
