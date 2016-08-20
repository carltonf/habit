const CommitAction = require('./commit-action');
const helpers = require('./_helpers');

function registerTo(program) {
  // NOTE For now, the life cycle of the post is flexible and there is no hard
  // limit on the state transition
  program
    .command('commit [post_path]')
    .description('commit post, all unset fields will be the same as last')
    .option('-S, --stage <stage>', 'Set the stage of the post')
    .option('-t, --title_abbr <title_abbr>', 'Set the abbreviated title')
    .option('-s, --state <state>', 'Set the state')
    .option('-p, --state_percent <state_percent>', 'Set the state percent')
    .option('-d, --desc <desc>', 'Set the description')
  // TODO currently adding non-field option will yield problems
    .action(function (post_path, options) {
      post_path = post_path || helpers.getCWP();

      let action = null;
      try{
        action = new CommitAction(post_path);

        let newStatusJSON = action.updateStatus( this.opts() );

        action.commit(newStatusJSON);
      } catch(e) {
        console.error('* Error: ' + e.message);
        // TODO possible different error status code?
        // May not be necessary as the error code will not be used anywhere.
        // Negative number indicating error might be good enough.
        return -1;
      } finally {
        // NOTE print warnings to provide some info to the user.
        let warning = null;
        while (warning = action.dequeueWarnings()){
          console.warn('* WARNING: ' + warning);
        }
      }
    });
}

module.exports = {
  registerTo: registerTo,
};
