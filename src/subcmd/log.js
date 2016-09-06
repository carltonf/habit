const helpers = require('./_helpers');

function registerTo(program) {
  program
    .command('log [post_path]')
    .description('Show the complete Git log for `post_path` or `cwp`.')
    .action(function (post_path) {
      post_path = post_path || helpers.getCWP();

      try {
        let action = new LogAction(post_path);
        let log = action.getLog();

        console.log( log );
      } catch (e) {
        console.error(e.message);

        return -1;
      }
    });
}

module.exports = {
  registerTo: registerTo,
}

//////////////////////////

function LogAction(postPath) {
  this.postPath = postPath;

  helpers.assertPostPath(postPath);
}

LogAction.prototype.getLog = function getLog () {
  return this.__getLog();
}

// External Deps
const post_logger = require('../git/post-log');

LogAction.prototype.__getLog = function __getLog () {
  return post_logger.log(this.postPath);
}
