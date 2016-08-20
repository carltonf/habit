const assert = require('assert');
const helpers = require('./_helpers');

function CommitAction(postPath) {
  // NOTE a warning message queue that clients can access through
  // `dequeueWarnings`. Useful to output some helpful info (other better
  // approaches?)
  this._warnings = [];

  this.postPath = postPath;
  helpers.assertPostPath(postPath);
  this.assertCanCommit();

  this.statusJSON = this.getCurrentStatusJSON();
}

CommitAction.prototype.dequeueWarnings = function dequeueWarnings () {
  return this._warnings.shift();
}

// NOTE a simple function to copy a json object. Objects in general are hard to
// clone.
function _copyJSONObj (json) {
  return JSON.parse( JSON.stringify(json) );
}

function _assertDifferentStatus(json1, json2) {
  // TODO? this comparison is too simplistic
  assert( JSON.stringify(json1) !== JSON.stringify(json2),
          'New status must be different from current.')
}

CommitAction.prototype._updateFieldsFromOpts
  = function _updateFieldsFromOpts (json, opts) {
    let updatedFields = helpers.parseFieldsFromOpts(opts, helpers.FIELD_KEYS);
    for (let field in updatedFields) {
      if ( field === 'title_abbr' && json.title_abbr ) {
        this._warnings.push('title_abbr can NOT be changed. Ignored.')
        continue;
      }

      json[field] = updatedFields[field];
    }

    return json;
}

CommitAction.prototype.updateStatus = function updateStatus (opts) {
  let newStatusJSON = _copyJSONObj(this.statusJSON);

  newStatusJSON = this._updateFieldsFromOpts(newStatusJSON, opts)

  _assertDifferentStatus(newStatusJSON, this.statusJSON);

  // NOTE handle description specially. 'description' field is optional, but
  // usually it makes no sense to be the same as the last
  if ( newStatusJSON.description === this.statusJSON.description ){
    delete newStatusJSON.description;
  }

  return newStatusJSON;
};

CommitAction.prototype.commit = function commit(json) {
  this.__commit(json);
};

CommitAction.prototype.assertCanCommit = function assertCanCommit () {
  assert(this.__canCommit(), `No changes yet for ${this.postPath}`);
};

CommitAction.prototype.getCurrentStatusJSON = function getCurrentStatusJSON () {
  let json = this.__getStatusJSON();
  // NOTE be more forgiving, needed as old post and new post do not have
  // valid old git message.
  if (json === null) {
    this._warnings.push('no previous status can be found.');
    json = {};
  }
  return json;
};

///// External dependencies
const post_logger = require('../git-post-log');
const git_msg_parser = require('../git-msg-parser');
const git_msg_generator = require('../git-msg-generator');
const git_post_commit = require('../git-post-commit');

CommitAction.prototype.__canCommit = function __canCommit() {
  return git_post_commit.can_commit(this.postPath);
};

// TODO same as what in `status-action`
CommitAction.prototype.__getStatusJSON = function __getStatusJSON () {
  let status = post_logger.raw_status(this.postPath);
  return git_msg_parser.parse(status);
}

CommitAction.prototype.__commit = function __commit(json) {
  let commitMsg = git_msg_generator.generate(json);
  git_post_commit.commit(this.postPath, commitMsg);
}


module.exports = CommitAction;
