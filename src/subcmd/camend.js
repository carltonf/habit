const helpers = require('./_helpers');

function CAmendAction (postPath) {
  this.postPath = postPath;

  helpers.assertPostPath(postPath);
}

CAmendAction.prototype.commitAmend = function commitAmend () {
  this.__commitAmend(this.postPath)
}

//// External
const git_post_camend = require('../git/post-commit').amend;
CAmendAction.prototype.__commitAmend = function __commitAmend(postPath) {
  git_post_camend(postPath);
}

function registerTo(program) {
  // TODO the following can be problematic as it doesn't check whether the tip of
  // the branch is a commit of this post and there is also no check for whether
  // the commit is pushed to remote already. I've required CWP to be set to
  // remind these issues.
  program
    .command('camend')
    .description('commit --amend -- $CWP. Works ONLY with CWP set.')
    .action(function () {
      try {
        let camendAction = new CAmendAction(helpers.getCWP());

        camendAction.commitAmend();
        // NOTE output sth., Git seems to be quiet on amending.
        console.log('* INFO: commit --amend with newest changes.');
      }
      catch (e) {
        console.error('* Error: ' + e.message);
        return -1;
      }
    });
}

module.exports = {
  registerTo: registerTo,
}
