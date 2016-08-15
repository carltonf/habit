// get formated log for a post/draft
//
// input: post path, number of posts
// output: string
//
const spawn_sync = require('child_process').spawnSync;

// NOTE `num`: number of log entries to retrieve, 0 or undefined means all
function git_post_log(post_path, num) {
  let git_args = ['log', '--', post_path];
  // NOTE: only pass log entry count when the number arg is given
  // PS: passing empty string '' to spawn_sync yields error
  if (num && typeof num === 'number') {
    git_args.splice(1, 0, `-${num}`);
  }

  let spawn_result = spawn_sync('git', git_args);
  if (spawn_result.status !== 0) {
    throw new Error('* git log failed with status ' + spawn_result.status);
  }

  return spawn_result.stdout.toString();
}

modules.exports = {
  log: git_post_log,
  // export status for convenience
  status: git_post_log.bind(null, 1);
}
