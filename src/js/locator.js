/*******************locator.js start***********************/
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
Events:
  * dispatches 'new-location' when a new geo
    object is received
Functions:
  * getLoc(cb) Updates the user's geolocation
    and fires the DOM event 'new-location' with
    user's location
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
    timeout: 10000,
    maximumAge: 10000
  };

  function Constructor () { }

  Constructor.prototype.getLoc = function (maxAge, maxAccuracy, cb) {
    if (typeof arguments[0] === 'function') {
      cb = arguments[0];
      maxAccuracy = 5000;
      maxAge = 600000;
    }
    if (maxAge) {
      positionOptions.maximumAge = maxAge;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getPositionData, getPositionError, positionOptions);
    } else {
      alert('Your browser does not support geolocation.');
    }

    function getPositionData (position) {
      userLoc = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };
      var event = new CustomEvent('new-location', { detail: userLoc });
      document.dispatchEvent(event);
      console.log(position);
      if(userLoc.accuracy < maxAccuracy){
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

/**************************locator.js end****************************/