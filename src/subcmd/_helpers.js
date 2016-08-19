const CWP_ENV = 'habit_working_post';

function getCWP () {
  return process.env[CWP_ENV] || null;
}

// function _get_post_status_json (post_path) {
//   let status = post_logger.raw_status(post_path);
//   return git_msg_parser.parse(status);
// }


// NOTE Parse post status field from commander options. If `fieldKeys` is not
// supplied, all keys in `opts` are considered field key.
function parseFieldsFromOpts(opts, fieldKeys) {
  let fields = [];
  fieldKeys = fieldKeys || Object.keys(opts);
  for (let opt in opts) {
    if ( fieldKeys.indexOf(opt) === -1 ) {
      continue;
    }
    let optVal = opts[opt];
    if (optVal){
      // TODO a workaround for 'description' problem
      if ( opt === 'desc' ) {
        opt = 'description';
      }
      fields.push(opt);
    }
  }

  return fields;
}

module.exports = {
  CWP_ENV: CWP_ENV,
  getCWP: getCWP,
  parseFieldsFromOpts: parseFieldsFromOpts
}
