'use strict';
/*global App*/

/*
-- App.heartbeat --
Acts as a controller for update behavior.
Responsible for all periodic front-end behavior.
Runs 1 second setTimeout loop and checks time
deltas for other behavior to fire them.
Currently updates App.locator.getLoc(cb)
depending on the geolocation mode

*/

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
function Heartbeat () {
  var beatHandle;
  var mode = '';

  var beat = function(){
    //console.log('beat');

  };

  function Constructor() {}

  Constructor.prototype.startBeat = function(){
    beatHandle = setInterval(beat, 1000);
  };

  Constructor.prototype.stopBeat = function(){
    if(beatHandle){
      clearInterval(beatHandle);
    }
  };

  return new Constructor();
}

App.heartbeat = new Heartbeat();
App.heartbeat.startBeat();