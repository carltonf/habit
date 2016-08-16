// Generate git commit message for jekyll habit
//
// Input: Json data
// Output: string
//
var validate = require('./git-msg-validator').validate;

function git_msg_generate (jsdata) {
  validate(jsdata);

  // NOTE avoid 'undefined'
  var percent_line = jsdata.state_percent || '';
  var description_line = '';

  // NOTE pay attention to the # of newlines
  if ( jsdata.description ) {
    description_line = `* description: ${jsdata.description}\n`;
  }

  var msg =
`habit(${jsdata.stage}): ${jsdata.title_abbr}

* status: ${jsdata.state} ${percent_line}
${description_line}`;

  return msg;
}

module.exports = {
  generate: git_msg_generate,
};
