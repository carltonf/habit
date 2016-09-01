const assert = require('assert');
const helpers = require('./_helpers');

function StatusAction(postPath) {
  this.postPath = postPath;

  helpers.assertPostPath(postPath);
}

StatusAction.prototype.getStatus = function getStatus (opts) {
  let status = null;
  opts = opts || {};
  let fields = helpers.parseFieldsFromOpts( opts, helpers.FIELD_KEYS );

  if ( Object.keys(fields).length === 0 ){
    status = this.__getStatusStr();
  }
  else {
    let statusJSON = this.__getStatusJSON();

    assert(statusJSON, '* Error: no valid status JSON! (data corruption?)');

    status = {};
    // NOTE do NOT confuse `in` with `of`. Maybe the use of these two should be
    // discouraged.
    for (let field in fields ) {
      status[field] = statusJSON[field];
    }

    status = JSON.stringify(status);
  }

  // NOTE trimed to sanitize the output
  return status.trim();
};

////////////////
// NOTE Wrap external dependencies in small simple methods that can be easily
// stubbed out in tests.
//
const post_logger = require('../git-post-log');
const git_msg_parser = require('../git-msg-parser');

StatusAction.prototype.__getStatusStr = function __getStatusStr () {
  return post_logger.status(this.postPath);
}

StatusAction.prototype.__getStatusJSON = function __getStatusJSON () {
  let status = post_logger.raw_status(this.postPath);
  return git_msg_parser.parse(status);
}


module.exports = StatusAction;
