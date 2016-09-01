// commander sub command 'status'
const StatusAction = require('./status-action');
const helpers = require('./_helpers');

function registerTo(program){
  program
    .command('status [post_path]')
    .description('Show status for `post_path` or `cwp`. With no option, print raw git message.')
    .option('-S, --stage', 'Only print the stage of the post')
    .option('-t, --title_abbr', 'Only print the abbreviated title')
    .option('-s, --state', 'Only print the state')
  // TODO believe to be a bug, if we use 'description' here, it shows that it's a
  // [Function] and setting it won't work
    .option('-d, --desc', 'Only print the description')
    .action(function (post_path, options){
      post_path = post_path || helpers.getCWP();

      try{
        let action = new StatusAction(post_path);
        let status = action.getStatus( this.opts() );

        if (status === '') {
          // NOTE More informative on empty status
          console.log('* INFO: no existing status found. New post?');
        }
        else {
          console.log(status);
        }
      } catch(e) {
        // NOTE only print the message field, try to be user-friendly
        console.error(e.message);
        return -1;
      }
    });
}

module.exports = {
  registerTo: registerTo,
};
