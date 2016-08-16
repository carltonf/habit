var program = require('commander');

const post_logger = require('./src/git-post-log');
const spawn = require('child_process').spawn;

// FIX: dbg
process.chdir('/home/vagrant/work/carltonf-blog-source');
const cwp = '_posts/2016-08-11-a-learning-guide-gnome-shell-bug-fixing.md';
// dbg ENDs

program.version('0.0.1')

program
  .command('status [post_path]')
  .description('Show status for `post_path` or `cwp`')
  .action(function (post_path) {
    post_path = post_path || cwp;
    let status = post_logger.status(post_path);
    console.log(status);
  });

program
  .command('edit [post_path]')
  .option('-e --emacsclient', 'edit with Emacs(ecn)')
  .description('edit post with vi')
  .action(function (post_path, options) {
    let editor = 'vi';
    if (options.emacsclient) {
      editor = 'ecn';
    }
    post_path = post_path || cwp;

    spawn(editor, [post_path], {stdio: 'inherit'});
  });

program.parse(process.argv);
