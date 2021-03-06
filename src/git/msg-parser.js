// Parse the git commit message of `habit`
//
// Input: string
// Output: json data (for consumption of other js modules), or null if the input
// msg is invalid
//
// NOTE check 'validator' file for format definition
var validator = require('./msg-validator');

// NOTE regexp literal notation is used here for both convenience and
// efficiency. Normally all references to keywords like `habit` should be using
// constant enum from `keywords-enum`
const HEADER_PAT = /^habit\((\w+)\):[ \t]+(\w(?:.*\w)?)\s*$/;
const STATE_PAT = /^\* state:[ \t]+(\w+)(?: ([0-9]{2}%))?\s*$/;
const DESCRIPT_PAT = /^\* description:[ \t]+(\w(?:.*\S)?)\s*$/;

function __split_msg (msg) {
  var arr = msg.split(/\n+/);

  return arr.slice(0,3);
}

function git_msg_parse (msg) {
  var [header, state, description] = __split_msg(msg);
  var json = {}
  var match_data;

  if ( !header ) { return null; }
  match_data = header.match(HEADER_PAT);
  if (match_data){
    json.stage = match_data[1];
    json.title_abbr = match_data[2];
  }

  if ( !state ) { return null; }
  match_data = state.match(STATE_PAT);
  if (match_data) {
    json.state = match_data[1];
    if (match_data[2]){
      json.state_percent = match_data[2];
    }
  }

  // NOTE description is optional
  if ( description ) {
    match_data = description.match(DESCRIPT_PAT);
    if (match_data) {
      json.description = match_data[1];
    }
  }

  try {
    validator.validate(json)
  }
  catch(e) {
    if (e instanceof SyntaxError){
      return null;
    }

    throw e;
  }

  return json;
}

module.exports = {
  parse: git_msg_parse,
  // NOTE exported for test
  __split_msg: __split_msg,
  HEADER_PAT: HEADER_PAT,
}
