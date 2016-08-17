// Keyword constants

const keywords = [
  'habit', 'state', 'description'
];

function _generate_enum (words) {
  let resEnum = {};
  for (let word of words) {
    let key = word.toUpperCase();
    resEnum[key] = word;
  }

  return resEnum;
}

const keywordsEnum = Object.freeze( _generate_enum(keywords) );

module.exports = keywordsEnum;
