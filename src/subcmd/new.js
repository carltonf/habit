// Create new draft/posts
const helpers = require('./_helpers');
const NewAction = require('./new-action');

function registerTo(program) {
  program
    .command('new <title>')
    .description('Create new draft with the given <title>')
    .action(function (title) {
      try {
        let action = new NewAction(title);

        action.createPost();

        console.log('* INFO: new post was created at ' + action.relpath);
      } catch (e) {
        console.error('* Error: ' + e.message);

        return -1;
      }
    });
}

module.exports = {
  registerTo: registerTo,
}
