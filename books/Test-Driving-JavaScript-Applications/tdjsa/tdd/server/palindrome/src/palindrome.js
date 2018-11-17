module.exports = function(phrase) {
  if(phrase === undefined) {
    throw new Error('Invalid argument');
  }
  return phrase.trim().length > 0 && phrase.split('').reverse().join('') == phrase;
};
