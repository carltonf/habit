const path = require('path');

const sanitize = require('../filename/sanitize');
const yamlNewHeader = require('../yaml/new');

function NewAction(title) {
  this.title = title;
  this.titleFn = sanitize(title);
  // NOTE relative to TOP
  this.relpath = '';
}

NewAction.prototype.createPost = function createPost (type) {
  // TODO default to 'draft', for now there is only 'draft'
  type = type || 'draft';
  let fnExt = 'md';

  // TODO TOP env dep feels bad. If not set, assume we are in $TOP.
  let TOP = process.env['TOP'] || path.normalize('.');
  this.relpath = path.join('_drafts', `${this.titleFn}.${fnExt}`);
  let filepath = path.join( TOP, this.relpath );

  this.__assertExistence(filepath);

  let data = yamlNewHeader(this.title);
  this.__newPost(filepath, data);
}

// External Deps
const fs = require('fs');

NewAction.prototype.__assertExistence = function __assertExistence (filepath) {
  // NOTE Throw exception if file exists.
  // TODO a better way?
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
  } catch (e) {
    // NOTE Nothing should be done.
    return;
  }

  throw new Error('already exists: ' + filepath);
}

NewAction.prototype.__newPost = function __newPost (filepath, data) {
  fs.writeFileSync(filepath ,data);
}


module.exports = NewAction;
