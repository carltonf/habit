const assert = require('assert');
const helpers = require('./_helpers');

function CommitAction(postPath) {
  // NOTE a warning message queue that clients can access through
  // `dequeueWarnings`. Useful to output some helpful info (other better
  // approaches?)
  this._warnings = [];

  this.postPath = postPath;
  helpers.assertPostPath(postPath);

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
  this.__updateYAMLHeader();
  this.__commit(json);
};

// NOTE the init/first status for a draft. `title_abbr` has to be manually set
// though.
const INIT_DRAFT_JSON = {
  stage: 'draft',
  state: 'scaffolding',
  description: 'init',
};

CommitAction.prototype.getCurrentStatusJSON = function getCurrentStatusJSON () {
  let json = this.__getStatusJSON();
  // NOTE be more forgiving, needed as old post and new post do not have
  // valid old git message.
  if (json === null) {
    this._warnings.push('No previous status can be found. Assumed default.');
    json = INIT_DRAFT_JSON;
  }
  return json;
};

///// External dependencies
const post_logger = require('../git-post-log');
const git_msg_parser = require('../git-msg-parser');
const git_msg_generator = require('../git-msg-generator');
const git_post_commit = require('../git-post-commit');
const yamlUpdate = require('../yaml/update');
const getLongDateStr = require('../date/getLongDateStr');

const fs = require('fs');


// TODO same as what in `status-action`
CommitAction.prototype.__getStatusJSON = function __getStatusJSON () {
  let status = post_logger.raw_status(this.postPath);
  return git_msg_parser.parse(status);
}

function eachLineSync (filename, iteratee) {
  return fs.readFileSync(filename, 'utf8')
    .split('\n').map(iteratee).join('\n');
}

CommitAction.prototype.__updateYAMLHeader = function __updateYAML(json) {
  // NOTE for now only update `last_modified_at`
  let YAML_SEP = '---';
  let yamlSepCount = 0;
  let yamlBlock = [];

  let parsedData = eachLineSync(this.postPath, function(line) {
    if (yamlSepCount === 2) {
      return line;
    }

    if (YAML_SEP === line) {
      yamlSepCount++;
      return line;
    }

    let todayStr = getLongDateStr( new Date() );
    return yamlUpdate(line, todayStr, 'last_modified_at');
  });

  fs.writeFileSync(this.postPath, parsedData, 'utf8');
};

CommitAction.prototype.__commit = function __commit(json) {
  let commitMsg = git_msg_generator.generate(json);
  git_post_commit.commit(this.postPath, commitMsg);
}


module.exports = CommitAction;
