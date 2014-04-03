/******************************locator.js start******************************/
'use strict';
/*global alert*/
/*global App*/

/*
-- App.locator --
Keeps track of the user's last known position.
Coordinates are stored in an array as follows:
[ longitude, latitude ]
A timestamp is also kept denoting the last
time a geolocation was successfully fetched.
Functions:
  * getLoc(cb) Updates the user's geolocation
    and takes a callback function which receives
    the coordinates
  * locAge() Returns time since last lookup in
    seconds
  * showLoc() Simply returns the stored
    coordinates without performing another
    lookup
  * locStatus() returns object with bool of
    location validity and the location accuracy
 */
function Locator () {
  var userLoc = {
    lat: null,
    lon: null,
    accuracy: null,
    timestamp: null
  };
  var lastGoodLoc;
  var maximumAccuracy = 1000;
  var positionOptions = {
    enableHighAccuracy: false,
    timeout: 3000,
    maximumAge: 10000
  };

  function Constructor () { }

  Constructor.prototype.getLoc = function (cb, maxAge, maxAccuracy) {
    if(maxAge){ positionOptions.maximumAge = maxAge; }
    if(maxAccuracy){ maximumAccuracy = maxAccuracy; }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getPositionData, getPositionError, positionOptions);
    } else {
      alert('Your browser does not support geolocation.');
    }

    function getPositionData (position){
      console.log(position);
      userLoc = {
        lat: position.coords.lattitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };
      if(userLoc.accuracy < maximumAccuracy){
        //cache the last userLoc of sufficient accuracy
        lastGoodLoc = userLoc;
      }
      if (cb) {
        cb(userLoc);
      }
    }

    function getPositionError (error){
      console.log(error);
    }
  };

  Constructor.prototype.locAge = function () {
    return Date.now() - userLoc.timestamp;
  };

  Constructor.prototype.showLoc = function () {
    return {
      userLoc: userLoc,
      lastGoodLoc: lastGoodLoc
    };
  };

  // Allows Casper to set the user's location for testing
  Constructor.prototype.setLoc = function (loc) {
    userLoc = loc;
    lastGoodLoc = loc;
  };

  return new Constructor();
}

App.locator = new Locator();
App.locator.getLoc();
/******************************locator.js end******************************/