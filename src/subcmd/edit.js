const child_process = require('child_process');

const helpers = require('./_helpers');

// TODO a configuration option for this might be better (or from editor env)
const VI_CMD = 'vi';
const EMACS_CMD = 'ecn';
const DEFAULT_EDITOR_CMD = VI_CMD;

function EditAction (postPath) {
  this.postPath = postPath;

  helpers.assertPostPath(postPath);
}

EditAction.prototype.edit = function edit(cmd) {
  this.editor = cmd;
  this.__invokeEditor();
};

EditAction.prototype.__invokeEditor = function __invokeEditor() {
  child_process.spawnSync(this.editor,
                          [this.postPath],
                          {stdio: 'inherit'});
};

function registerTo(program){
  program
    .command('edit [post_path]')
  // TODO long option name is too long, change to `ecn`
    .option('-e --emacsclient', 'edit with Emacs(ecn)')
    .description('edit post with vi')
    .action(function (post_path, options) {
      post_path = post_path || helpers.getCWP();

      try {
        let editAction = new EditAction(post_path);
        let editor = DEFAULT_EDITOR_CMD;
        if (options.emacsclient) {
          editor = EMACS_CMD;
        }

        editAction.edit(editor);
      } catch (e) {
        console.error(e.message);
        return -1;
      }
    });
}

module.exports = {
  registerTo: registerTo,
};
