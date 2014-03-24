'use strict';

module.exports = function(){

  console.log('I exist!!!!!')

  function _C(){}

  var d = new Date();

  _C.prototype.getDate = function(){
    return d;
  };

  _C.prototype.getTime = function(){
    var hh = d.getHours();
    var mm = d.getMinutes();

    return hh+':'+mm;
  };

  _C.prototype.getLocation = function(){
    //bunch of geolocation stuff here
  }

  return new _C();

};
