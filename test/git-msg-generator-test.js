var generate = require('../src/git/msg-generator').generate;
var expect = require('chai').expect
var K = require('../src/keywords-enum');

describe('git/msg-generator', () => {

  describe('generate', () => {
    var jsdata;
    var expected_msg;

    beforeEach(() => {
      jsdata = {
        title_abbr: 'my awesome post',
        stage: 'post',
        state: 'polishing',
        state_percent: '70%',
      };

      // NOTE use backtick here so we can easily write multi-line string
      expected_msg =
`${K.HABIT}(post): my awesome post

* ${K.STATE}: polishing 70%
`;
    });

    it ('works with description', () => {
      jsdata.description = 'awesome editing';
      expected_msg += `* ${K.DESCRIPTION}: awesome editing\n`;

      expect(generate(jsdata)).to.equal(expected_msg);
    });

    it ('works with empty description', () => {
      jsdata.description = '';

      expect(generate(jsdata)).to.equal(expected_msg);
    });

    it ('works with non-existent empty', () => {
      delete jsdata.description;

      expect(generate(jsdata)).to.equal(expected_msg);
    });

    it ('works with empty percent', () => {
      expected_msg =
`${K.HABIT}(post): my awesome post

* ${K.STATE}: polishing 
`;
      delete jsdata.state_percent;

      expect(generate(jsdata)).to.equal(expected_msg);
    });
  });

});
