'use strict';

var App = {};

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

Functions:
  * startBeat() starts the setInterval beat
  function
  * stopBeat() stops the currently running
  beat function
*/
function Heartbeat () {
  var beatHandle;
  var geolocMode = 'rapid';
  var rapidGeolocFreq = 5000;

  var beat = function(){
    //geoloc handler
    if(geolocMode === 'rapid'){
      var locAge = App.locator.locAge();
      if(!(locAge > 0 && locAge <= rapidGeolocFreq)){
        //App.locator.getLoc(function(loc){console.log(loc);});
      }
    }
  };

  function Constructor() {}

  Constructor.prototype.startBeat = function(){
    if(!beatHandle){
      beatHandle = setInterval(beat, 1000);
      console.log('beat function started');
    }
  };

  Constructor.prototype.stopBeat = function(){
    if(beatHandle){
      clearInterval(beatHandle);
      beatHandle = null;
    }
  };

  return new Constructor();
}

App.heartbeat = new Heartbeat();
App.heartbeat.startBeat();
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

  return new Constructor();
}

App.locator = new Locator();
App.locator.getLoc();
'use strict';
/*global App*/

/*
-- App.postman --
Handles the fetching, storing and rendering of
all posts. The REST endpoint is passed as an
argument when it is initialized.
 */
function Postman (endpoint) {
  var url = document.URL + endpoint,
    models;
  function Constructor () { }
  Constructor.prototype.XHR = function (method, data, url, async, cb) {
    var req = new XMLHttpRequest();
    req.open(method, url, async);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    //req.responseType = '';
    req.onload = function () {
      if (req.status >= 200 && req.status < 400) {
        if (req.responseText) {
          cb(req.responseText);
        } else {
          cb();
        }
      } else {
        return false;
      }
    };
    req.onerror = function (err) {
      console.log('XHR Error: ' + JSON.stringify(err));
    };
    if (data) {
      console.log("bad data: " + JSON.stringify(data));
      req.send(JSON.stringify(data));
    } else {
      req.send();
    }
  };

  Constructor.prototype.fetch = function () {
    return this.XHR('GET', null, url, true, function (data) {
      models = JSON.parse(data);
    });
  };

  Constructor.prototype.show = function () {
    return models;
  };

  Constructor.prototype.post = function (data, cb) {
    /* location functionality */
    return this.XHR('POST', data, url, true, cb);
  };

  Constructor.prototype.newFeed = function (loc) {
    console.log('data to newFeed function: ' + console.log(loc));
    this.XHR('GET', [loc.lon, loc.lat], 'localhost:3000/api/v1/feed', true, function (posts) {
        console.log('Received feed:' + JSON.stringify(posts));
    });
  };

  return new Constructor();
}
App.postman = new Postman('api/v1/posts');


// function microAjax(url, callbackFunction)
// {
//   this.bindFunction = function (caller, object) {
//     return function() {
//       return caller.apply(object, [object]);
//     };
//   };

//   this.stateChange = function (object) {
//     if (this.request.readyState==4)
//       this.callbackFunction(this.request.responseText);
//   };

//   this.getRequest = function() {
//     if (window.ActiveXObject)
//       return new ActiveXObject('Microsoft.XMLHTTP');
//     else if (window.XMLHttpRequest)
//       return new XMLHttpRequest();
//     return false;
//   };

//   this.postBody = (arguments[2] || "");

//   this.callbackFunction=callbackFunction;
//   this.url=url;
//   this.request = this.getRequest();

//   if(this.request) {
//     var req = this.request;
//     req.onreadystatechange = this.bindFunction(this.stateChange, this);

//     if (this.postBody!=="") {
//       req.open("POST", url, true);
//       req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//       req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//       req.setRequestHeader('Connection', 'close');
//     } else {
//       req.open("GET", url, true);
//     }

//     req.send(this.postBody);
//   }




// request = new XMLHttpRequest();
// request.open('GET', '/my/url', true);

// request.onload = function() {
//   if (request.status >= 200 && request.status < 400){
//     // Success!
//     data = JSON.parse(request.responseText);
//   } else {
//     // We reached our target server, but it returned an error

//   }
// };

// request.onerror = function() {
//   // There was a connection error of some sort
// };

// request.send();
// }




var messageOut = document.getElementById('message-out');
var posts = document.getElementById('post-display');
var submit = document.getElementById('submit-post');

submit.addEventListener(function (e) {
  console.log(e);
});

var data =  {
  timestamp : new Date()
  // author    : { type: Schema.ObjectId },
  // body      : {  },
  // comments  : [ Comment ],
  // tempname  : { type: String },
  // tempnames : [{ type: String }]
};

submit.disabled = true;

App.locator.getLoc(function (loc) {
  console.log('data to page: ' + JSON.stringify(loc));
  submit.disabled = false;
  submit.addEventListener('click', function() {
    var data = {};
    data.body = messageOut.value.toString();
    data.loc = { type: "Point", coordinates: [ loc.lon, loc.lat ] };
    App.postman.post(data, function (res) {
      console.log('post ok, contents - ' + JSON.stringify(res));
    })
  }, false);

});