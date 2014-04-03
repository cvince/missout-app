/**
 * Created by tim on 4/2/14.
 */
var name = require('./names');

module.exports = function (usedNames) {
  function randName (usedNames) {
    var newName = name.firsts[Math.floor(Math.random() * name.firsts.length)] +
    name.lasts[Math.floor(Math.random() * name.lasts.length)];
    if (usedNames && usedNames.indexOf(newName)) {
      return randName(usedNames);
    } else {
      return newName;
    }
  }
  return randName(usedNames);
};
