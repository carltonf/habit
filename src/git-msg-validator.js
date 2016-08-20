// Validator: effectively serves as a specification for the format
//
const STATE_PERCENT_PAT = /[0-9]{2}%/;
const STATES = {
  draft: [ 'scaffolding', 'fledging', 'editing' ],
  post: [ 'polishing', 'reviewing' ],
};
const STAGES = Object.keys(STATES);

// NOTE: function that throws exceptions but return true if everything passes
function git_msg_validate (jsdata) {
  if ( !(STAGES.includes(jsdata.stage)) ) {
    throw new SyntaxError("post is not in any known stages: " + jsdata.stage);
  }

  var allowed_states = STATES[jsdata.stage]
  if ( !(allowed_states.includes(jsdata.state)) ) {
    throw new SyntaxError("post is not in any valid state: " + jsdata.state);
  }

  // NOTE Actually `undefined` and `''` are both false value, but let's be
  // explicit here.
  if ( ! ('title_abbr' in jsdata) || jsdata.title_abbr.length === 0 ) {
    throw new SyntaxError("post title abbreviation can not be empty or nonexistent");
  }

  // NOTE Optional, can be non-existent or empty, but need to be valid percentage
  //
  var state_percent = jsdata.state_percent;
  if ( typeof state_percent === 'string'
       && state_percent.length !== 0
       && !state_percent.match(STATE_PERCENT_PAT)) {
    throw new SyntaxError("post state percent is not valid: " + state_percent)
  }

  // NOTE no validation for 'description' field

  return true;
}


module.exports = {
    validate: git_msg_validate,
}
