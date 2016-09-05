// Update a specific field of YAML header
//
// TODO it's only used to update one-line fields like `date`, `last_modified_at`,
// `title`. Need YAML-parser capacity to handle more complicated fields like
// `tags` (npm packge like `js-yaml` or `node-yamlhead` might be of some use.)

// Input: `line` is the old one-line string "key: old-val", the parsor use the
// first colon as separator aand replace everything after it with `val`. A very
// simplistic parsor. `key` is optional, if set only update line that matches
// this key, if set but it doesn't match line's parsed key, return line unchanged.
//
// NOTE to be usable in callback, this function is very permissive, if the
// `line` doesn't look like a 'key:val' pair, return the line.
//
// Return a string "key: val"
function updateHeader(line, val, key) {
  let lineReg = /(\w+):.*/;

  let res = lineReg.exec(line);

  if ( res === null ) {
    return line;
  }

  if ( key && (key !== res[1]) ) {
    return line;
  }

  key = res[1];

  // NOTE there is no hard requirement for the existence of the `val` but should
  // be normalized to empty string to avoid awkward 'undefined' or 'null'.
  val = val || '';

  return `${key}: ${val}`;
}

module.exports = updateHeader;
