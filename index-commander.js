const fs = require('fs');

var program = require('commander');

const post_logger = require('./src/git-post-log');
const child_process = require('child_process');
const git_msg_parser = require('./src/git-msg-parser');

// FIX: dbg
process.chdir('/home/vagrant/try/blog-habit-sample');
// TODO: cwp should be from env
var cwp = 'my-blog.md';
// dbg ENDs

program.version('0.0.1')

program
  .command('status [post_path]')
  .description('Show status (git msg by default) for `post_path` or `cwp`')
  .option('-S, --stage', 'Only print the stage of the post')
  .option('-t, --title_abbr', 'Only print the abbreviated title')
  .option('-s, --state', 'Only print the state')
// TODO believe to be a bug, if we use 'description' here, it shows that it's a
// [Function] and setting it won't work
  .option('-d, --desc', 'Only print the description')
  .action(function (post_path, options) {
    post_path = post_path || cwp;
    let status = '';
    let allOpts = this.opts();
    let fields = [];

    for (let opt in allOpts) {
      let optVal = allOpts[opt];
      if (optVal){
        // TODO a workaround for 'description' problem
        if ( opt === 'desc' ) { opt = 'description'; }
        fields.push(opt);
      }
    }

    if ( fields.length === 0 ){
      status = post_logger.status(post_path);
    }
    else {
      status = post_logger.raw_status(post_path);
      let statusJSON = git_msg_parser.parse(status);
      // dbg
      status = fields.reduce( (res, field) => {
        res[field] = statusJSON[field];
        return res;
      }, {});
    }

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

    child_process.spawnSync(editor, [post_path], {stdio: 'inherit'});
  });

program
  .command('commit [post_path]')
  .description('commit post')
  .action(function (post_path) {
    // TODO maybe will refer to env EDITOR in the future
    let editor = 'vi';

    // FIX this introduced an OS-specific feature
    var tmpFolder = fs.mkdtempSync('/tmp/habit-');

    var commitMsg = '';

  })
// NOTE parse and execute
program.parse(process.argv);
