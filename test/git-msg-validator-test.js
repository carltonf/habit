var validate = require('../src/git/msg-validator').validate;
var expect = require('chai').expect

describe('git/msg-validator', () => {

  describe('validate', () => {
    var jsdata;

    // NOTE helper for test
    function expectToThrowSyntaxError(jsdata, msg_pat){
      expect(validate.bind(null, jsdata))
        .to.throw(SyntaxError, msg_pat);
    }

    beforeEach(() =>{
      jsdata = {
        stage: 'draft',
        state: 'fledging',
        title_abbr: 'my awsome post',
        state_percent: '70%',
        description: 'add awesome ref',
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

        expect(validate(jsdata)).is.true;
      });

      it ('allow non-existent state_percent', () => {
        delete jsdata.state_percent;

        expect(validate(jsdata)).is.true;
      });
    });

    it ('no validation for description', () => {
      // No validation
    });
  });
});
