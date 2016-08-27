// get formated log for a post/draft
//
// input: post path, number of posts
// output: string
//
const spawn_sync = require('child_process').spawnSync;

// NOTE `num`: number of log entries to retrieve, 0 or undefined means all.
// `format`: the format supported by `git log` command, see the man page for
// details.
function git_post_log(post_path, num, format) {
  // NOTE: add `follow` option to track moved files (e.g. from _drafts to _posts)
  let git_args = ['log', '--follow'];
  // NOTE: only pass log entry count when the number arg is given
  // PS: passing empty string '' to spawn_sync yields error
  if (num && typeof num === 'number') {
    git_args.push(`-${num}`);
  }

  if (format && typeof format === 'string') {
    git_args.push(`--format=${format}`);
  }

  // NOTE finally set target
  git_args.push('--', post_path);
  let spawn_result = spawn_sync('git', git_args);
  if (spawn_result.status !== 0) {
    throw new Error('* git log failed with status ' + spawn_result.status);
  }

  return spawn_result.stdout.toString();
}

// NOTE for convenience, show the most recent log
function git_post_status(post_path) {
  return git_post_log(post_path, 1);
}

// NOTE for parsing by git-msg-parser
function git_post_raw_status (post_path) {
  return git_post_log(post_path, 1, '%s%n%b');
}

module.exports = {
  log: git_post_log,
  status: git_post_status,
  raw_status: git_post_raw_status,
}
