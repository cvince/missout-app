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
 */
function Locator () {
  var userLoc = [];
  var lastLoc;

  function Constructor () { }

  Constructor.prototype.getLoc = function (cb) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        userLoc = [ position.coords.longitude,
          position.coords.latitude ];
        lastLoc = position.timestamp;
        if (cb) {
          cb(userLoc);
        }
      }, function (error) {
        console.log(error);
        alert('There was an error getting your location.');
      });
    } else {
      alert('Your browser does not support geolocation.');
    }
  };

  Constructor.prototype.locAge = function () {
    return Date.now() - lastLoc;
  };

  Constructor.prototype.showLoc = function () {
    return userLoc;
  };

  return new Constructor();
}

App.locator = new Locator();
App.locator.getLoc();