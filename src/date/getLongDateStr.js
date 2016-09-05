// Get long date string like '2016-08-09', i.e. with leading zeros

function getLongDateStr (date) {
  // NOTE trick to get dates with leading zeros
  // Ref: http://stackoverflow.com/a/6040556/2526378
  let dayStr = ( '0' + date.getDate() ).slice(-2) ;
  let monthStr = ( '0' + (date.getMonth() + 1) ).slice(-2);

  let dateStr = `${date.getFullYear()}-${monthStr}-${dayStr}`;

  return dateStr;
}

module.exports = getLongDateStr;
