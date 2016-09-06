// Generate git commit message for habit
//
// Input: Json data
// Output: string
//
var validate = require('./msg-validator').validate;
var K = require('../keywords-enum');

function git_msg_generate (jsdata) {
  validate(jsdata);

  // NOTE avoid 'undefined'
  var percent_line = jsdata.state_percent || '';
  var description_line = '';

  // NOTE pay attention to the # of newlines
  if ( jsdata.description ) {
    description_line = `* ${K.DESCRIPTION}: ${jsdata.description}\n`;
  }

  var msg =
`${K.HABIT}(${jsdata.stage}): ${jsdata.title_abbr}

* ${K.STATE}: ${jsdata.state} ${percent_line}
${description_line}`;

  return msg;
}

module.exports = {
  generate: git_msg_generate,
};
