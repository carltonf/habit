const assert = require('assert');

const CWP_ENV = 'habit_working_post';

function getCWP () {
  return process.env[CWP_ENV] || null;
}

// function _get_post_status_json (post_path) {
//   let status = post_logger.raw_status(post_path);
//   return git_msg_parser.parse(status);
// }

function assertPostPath (postPath) {
  // TODO very simplistic test, in the future add some real file testing
  // (existence, permission and etc.)
  assert(postPath, '* Error: post path and CWP is not set');
};

// NOTE Parse post status fields from commander options. If `fieldKeys` is not
// supplied, all keys in `opts` are considered field key.
//
// Return: an object containing key-value pair from `opts` with key in
// `fieldKeys` and value not undefined.
function parseFieldsFromOpts(opts, fieldKeys) {
  let fields = {};
  fieldKeys = fieldKeys || Object.keys(opts);
  for (let opt in opts) {
    if ( fieldKeys.indexOf(opt) === -1 ) {
      continue;
    }
    let optVal = opts[opt];
    if (typeof optVal !== 'undefined'){
      // TODO a workaround for 'description' problem
      if ( opt === 'desc' ) {
        opt = 'description';
      }

      fields[opt] = optVal;
    }
  }

  return fields;
}


const FIELD_KEYS = ['stage', 'title_abbr', 'state', 'desc'];

module.exports = {
  FIELD_KEYS: FIELD_KEYS,
  CWP_ENV: CWP_ENV,
  getCWP: getCWP,
  parseFieldsFromOpts: parseFieldsFromOpts,
  assertPostPath: assertPostPath,
}
