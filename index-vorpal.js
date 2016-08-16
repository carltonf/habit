const spawn = require('child_process').spawn;
const vorpal = require('vorpal')();
const post_logger = require('./src/git-post-log');

// FIX: dbg
process.chdir('/home/vagrant/work/carltonf-blog-source');
const cwp = '_posts/2016-08-11-a-learning-guide-gnome-shell-bug-fixing.md';
// dbg ENDs


vorpal
  .command('status [post_path]', 'Show status for `post_path` or `cwp`')
  .action(function(args, cb) {
    let post_path = args.post_path || cwp;
    let status = post_logger.status(post_path);
    this.log(status);

    cb();
  });

vorpal
  .command('log [post_path] [num]',  'Show log for `post_path` or `cwp`')
  .action(function(args, cb) {
    let post_path = args.post_path || cwp;
    let log = post_logger.log(post_path, args.num);
    this.log(log);

    cb();
  });

vorpal
  .command('cwp [post_path]', 'Print currnt working post or set `post_path` as cwp')
  .action(function(args, cb){
    if (args.post_path) {
      cwp = args.post_path;
      this.log('* New CWP: ' + cwp);
    }
    else {
      this.log('* CWP: ' + cwp);
    }

    cb();
  });

vorpal
  .command('edit [post_path]', 'Edit `post_path` or `cwp`')
  .action(function(args, cb) {
    let post_path = args.post_path || cwp;

    spawn('vi', [post_path], { stdio: 'inherit' });

    cb();
  });

vorpal
  .command('diff', 'Sample diff to see whether color is displayed')
  .action(function(args, cb) {
    let post_path = args.post_path || cwp;

    spawn('git', ['diff'], { stdio: 'inherit' });

    cb();
  })

// TODO not complete
vorpal
  .command('commit', 'Commit `cwp`.')
  .action(function(args, cb) {
    this.log('* Error: not complete.');

    cb();
  });


//  NOTE: The first element will be process.execPath. The second element will be
//  the path to the JavaScript file being executed. The remaining elements will
//  be any additional command line arguments.
if (process.argv.length > 2) {
  // TODO: the following largely works, but actions with `cb()` at the end
  // always falls into internal shell
  vorpal
    .delimiter('')
    .parse(process.argv);
}
else {
  vorpal
    .delimiter('habit> ')
    .show();
}
