const fs = require('fs');

var program = require('commander');

const post_logger = require('./src/git-post-log');
const child_process = require('child_process');
const git_msg_parser = require('./src/git-msg-parser');
const git_msg_generator = require('./src/git-msg-generator');
const git_post_commit = require('./src/git-post-commit');

// FIX: dbg
process.chdir('/home/vagrant/try/blog-habit-sample');
// TODO: cwp should be from env
var cwp = 'my-blog.md';
// dbg ENDs

program.version('0.0.1')

function _get_post_status_json (post_path) {
  let status = post_logger.raw_status(post_path);
  return git_msg_parser.parse(status);
}

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
      let statusJSON = _get_post_status_json(post_path);
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

// NOTE For now, the life cycle of the post is flexible and there is no hard
// limit on the state transition
program
  .command('commit [post_path]')
  .description('commit post, all unset fields will be the same as last')
  .option('-S, --stage <stage>', 'Set the stage of the post')
// NOTE title_abbr can NOT be set
// .option('-t, --title_abbr <title_abbr>', 'Set the abbreviated title')
  .option('-s, --state <state>', 'Set the state')
  .option('-p, --state_percent <state_percent>', 'Set the state percent')
  .option('-d, --desc <desc>', 'Set the description')
// TODO currently adding non-field option will yield problems
  .action(function (post_path) {
    post_path = post_path || cwp;

    if ( !git_post_commit.can_commit(post_path) ) {
      console.warn('* ERROR: no editing for ' + post_path);
      return -1;
    }

    let lastStatusJSON = _get_post_status_json(post_path);
    // NOTE we want a copy object here, lucky that the status is recorded in JSON
    let newStatusJSON = JSON.parse(JSON.stringify(lastStatusJSON));

    let allOpts = this.opts();
    for(let opt in allOpts) {
      let optVal = allOpts[opt];
      if (optVal) {
        // TODO a workaround for 'description' problem
        if ( opt === 'desc' ) { opt = 'description'; }
        newStatusJSON[opt] = optVal;
      }
    }

    // TODO this comparison is too simplistic
    if ( JSON.stringify(newStatusJSON) === JSON.stringify(lastStatusJSON) ) {
      console.log('* Error: new status can not be the same as the last.');
      return -1;
    }

    // NOTE handle description specially. 'description' field is optional, but
    // usually it makes little sense to be the same the last
    if ( newStatusJSON.description === lastStatusJSON.description ){
      delete newStatusJSON.description
    }

    // console.log('Old Status: \n' + JSON.stringify(lastStatusJSON));
    // console.log('New Status: \n' + JSON.stringify(newStatusJSON));
    // console.log('New Commit Msg: \n' + git_msg_generator.generate(newStatusJSON));

    let commitMsg = git_msg_generator.generate(newStatusJSON);
    git_post_commit.commit(post_path, commitMsg);
  });

// NOTE parse and execute
program.parse(process.argv);
