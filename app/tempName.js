module.exports = function(){

    function _arraySelector(array){
      var rndIndex = (Math.random() * array.length) << 0;
      return array[rndIndex];
    }

    function _nameGenerator(){
      var first = ['shapely', 'angry', 'hungry', 'morose', 'mistaken', 'handy',
                   'handsome', 'heroic', 'holistic', 'randy', 'pretty', 'magic',
                   'cheesy', 'nutty', 'viscous', 'fragrant', 'wholesome', 'red',
                   'loud', 'loaded', 'soulful', 'dancing', 'singing'];
      var second = ['peanut', 'horse', 'aardvark', 'dinosaur', 'kiwi', 'carrot',
                    'cabbage', 'weasel', 'porcupine', 'dog', 'chick', 'calf', 
                    'pup', 'cub', 'kitten', 'whelp', 'cod', 'sprat', 'nymph',
                    'duckling', 'eaglet', 'puggle', 'tadpole', 'froglet', 'piglet',
                    'hoglet', 'foal', 'joey', 'owlet', 'house', 'tree', 'woods',
                    'club'];
      var third = ['runner', 'watcher', 'rider', 'washer', 'eater', 'flyer', 'hider',
                  'lover', 'fixer', 'hoarder', 'hunter', 'lurker', 'maker', 'hater',
                  'raker', 'tailor', 'player', 'corker', 'porker', 'handler',
                  'trainer', 'ranger', 'surgeon', 'burglar'];
      var tempName = _arraySelector(first) + ' ' + _arraySelector(second) + ' ' + _arraySelector(third);
      console.log(tempName);
      return tempName;
    }

    return _nameGenerator();
}
