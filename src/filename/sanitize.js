// Sanitize title into file names, useful when creating new posts

// The algorithm is very simple, all consecuitive sequence of `/\W/` chars will
// be collapsed into a single hyphen and all remaining string snippets will be
// converted into lower case.
//
// Return a filename converted from title, like 'my-awesome-post'
function sanitize(title) {
  let partReg = /\w+/g;
  let matchRes = true;
  let fnParts = [];

  matchRes = partReg.exec(title);
  while (matchRes) {
    fnParts.push(matchRes[0].toLowerCase());
    matchRes = partReg.exec(title);
  }

  if (fnParts.length === 0) {
    throw new SyntaxError(`"${title}" is not good for post file name.`);
  }

  return fnParts.join('-');
}

module.exports = sanitize;
