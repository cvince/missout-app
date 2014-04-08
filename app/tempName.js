module.exports = function(){

    function _arraySelector(array){
      var rndIndex = (Math.random() * array.length) << 0;
      return array[rndIndex];
    }

    function _nameGenerator(){
      var first = ['battery', 'anchor', 'thermos', 'tent', 'spoon', 'nut', 'fork'];
      var second = ['peanut', 'horse', 'aardvark', 'echidna', 'kiwi', 'carrot', 'cabbage'];
      var third = ['runner', 'peeper', 'rider', 'washer', 'eater', 'flyer', 'hider'];
      var tempName = _arraySelector(first) + ' ' + _arraySelector(second) + ' ' + _arraySelector(third);
      console.log(tempName);
      return tempName;
    }

    return _nameGenerator();
}
