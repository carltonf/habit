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
  .command('edit [post_path]', 'Edit(vi) `post_path` or `cwp`')
  .option('-e, --emacs', 'Use emacs(ecn) to edit')
  .action(function(args, cb) {
    let post_path = args.post_path || cwp;
    let editor = 'vi';
    let spawn_options = { stdio: 'inherit' };

    if (args.options.emacs) {
      editor = 'ecn';
      // NOTE this is the `spawn` default
      spawn_options = { stdio: 'pipe' };
    }

    spawn(editor, [post_path], spawn_options);

    cb();
  });

vorpal
  .command('git [gitargs...]', 'Arbitrary cmds to Git')
// NOTE doesn't support '--no-cwp' style, the option name will be 'cwp' in this
// case
  .option('--nocwp', 'Do not pass `CWP` as last arg to Git')
  .action(function(args, cb) {
    let post_path = args.post_path || cwp;
    let withCWP = ! args.options['nocwp'];
    let gitArgs = args.gitargs;

    if (withCWP) {
      gitArgs.push('--', post_path);
    }

    spawn('git', gitArgs, { stdio: 'inherit' });

    // NOTE A trick to show delimiter after some stdio-inheritted cmd
    this.log('');
    cb();
  })

// TODO not complete
vorpal
  .command('commit', 'Commit `cwp`.')
  .action(function(args, cb) {
    this.log('* Error: not complete.');

    cb();
  });

// NOTE try to get C-P to work
// vorpal.on('keypress', function(eobj) {
//   // NOTE the key has no modifier info
//   this.log("Get key: " + eobj.key);
//   this.log('value: ' + eobj.value);
//   this.log("full event keys: " + Object.keys( eobj ));
// })


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
