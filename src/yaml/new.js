// Get a default YAML header for the new draft
//
// TODO we can have more control on the default template using configuration
// files.

const getLongDateStr = require('../date/getLongDateStr');

// NOTE `dateStr` is in a format like '2016-8-30'
// `title` value must be quoted to avoid potential 'colon' parsing error
var headerGen = (title, dateStr) =>
    `---
layout: post
title: "${title}"
date: ${dateStr}
last_modified_at: ${dateStr}
tags:
- default
---
`;

// NOTE `title` is mandatory, but `date` is optional. (Rarely the client needs
// to set `date`, it's here mainly for testing.)
function newHeader(title, date) {
  if (typeof title !== 'string') {
    throw new SyntaxError('Mandatory title is not set');
  }
  let today = date || new Date();
  let todayStr = getLongDateStr( today );

  return headerGen(title, todayStr);
}

module.exports = newHeader;
