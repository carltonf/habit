// Update a specific field of YAML header
//
// TODO it's only used to update fields like `date`, `last_modified_at`,
// `title`. Need YAML-parser capacity to handle more complicated fields like
// `tags` (npm packge like `js-yaml` or `node-yamlhead` might be of some use.)

// Input: `line` is the old one-line string "key: old-val", the parsor use the
// first colon as separator aand replace everything after it with `val`. A very
// simplistic parsor.
//
// Return a string "key: val"
function updateHeader(line, val) {
  let lineReg = /(\w+):.*/;

  let res = lineReg.exec(line);

  if ( res === null ) {
    throw SyntaxError(`"${line}" does not contain valid key.`);
  }
  let key = res[1];
  // NOTE there is no hard requirement for the existence of the `val` but should
  // be normalized to empty string to avoid awkward 'undefined' or 'null'.
  val = val || '';

  return `${key}: ${val}`;
}

module.exports = updateHeader;
