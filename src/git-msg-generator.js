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

  // TODO `habit`, `state` and the likes are keywords and should be encapsulated
  // in a enum, so changes to it only need to be done in one place.
  var msg =
`habit(${jsdata.stage}): ${jsdata.title_abbr}

* state: ${jsdata.state} ${percent_line}
${description_line}`;

  return msg;
}

module.exports = {
  generate: git_msg_generate,
};
