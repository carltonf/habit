// Get a default YAML header for the new draft
//
// TODO we can have more 

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

// NOTE `title` is mandatory, but `date` is optional
function newHeader(title, date) {
  let today = date || new Date();
  // NOTE trick to get dates with leading zeros
  // Ref: http://stackoverflow.com/a/6040556/2526378
  let dayStr = ( '0' + today.getDate() ).slice(-2) ;
  let monthStr = ( '0' + (today.getMonth() + 1) ).slice(-2);

  let todayStr = `${today.getFullYear()}-${monthStr}-${dayStr}`;

  return headerGen(title, todayStr);
}

module.exports = newHeader;
