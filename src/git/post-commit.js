// commit changes of the current working post
//
// input: post path, git msg
// output: status?
//
const spawn_sync = require('child_process').spawnSync;

// NOTE commit --amend --no-edit
function git_post_camend (post_path) {
  let git_args = ['commit', '--amend', '--no-edit', '--', post_path];
  let spawn_opts = { stdio: 'pipe' };

  spawn_sync('git', git_args, spawn_opts);
}

// NOTE by default, this function spawns up git and take user to the editing
// window, pre-populated with `msg`. Set `noedit` to true to inhibit this
// behavior.
function git_post_commit(post_path, msg, noedit) {
  // NOTE `git commit` can have multiple `-m` each is a paragraph on its own
  let paragraphs = msg.split(/\n+/);
  // NOTE `--verbose` will include post diff at the end of prepopulated comment.
  // Believed to be useful, so non-configurable for now
  let git_args = ['commit', '--verbose'];
  let spawn_opts = { stdio: 'pipe' };

  if ( !noedit ) {
    git_args.push('--edit');
    spawn_opts.stdio = 'inherit';
  }

  for (let para of paragraphs) {
    git_args.push('-m', para);
  }

  git_args.push('--', post_path);
  spawn_sync('git', git_args, spawn_opts);
}

// NOTE Test whether the `post_path` has any changes that can commit
//
// *Deprecated*: there seems to have no need to know whether a commit is
// *possible in advance.
function git_post_can_commit (post_path) {
  var diffStatus = spawn_sync('git', ['diff', '--name-only', '--', post_path])
  var diffOutput = diffStatus.stdout.toString();

  return ( diffOutput.length !== 0 );
}

module.exports = {
  commit: git_post_commit,
  can_commit: git_post_can_commit,
  amend: git_post_camend,
}
