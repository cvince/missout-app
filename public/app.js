'use strict';

var App = {};

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
    if (typeof arguments[0] === "function") {
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

  return new Constructor();
}

App.locator = new Locator();

'use strict';
/*global App*/

/*
-- App.postman --
Handles the fetching, storing and rendering of
all posts. The REST endpoint is passed as an
argument when it is initialized.
Events:
  * listens for 'new-location' and fetches a new
    feed
  * dispatches 'feedJSON' once the data for the
    new feed is obtained
Functions:
  * newFeed(loc) expects a point in the format
    { lon: Num, lat: Num } and sends the request
    to the feed endpoint
  * post(data, cb) creates a new post with the
    JSON in data param, and takes a callback
 */
function Postman (endpoint) {
  var url = endpoint,
      models,
      feed;
  function Constructor () { }
  Constructor.prototype.XHR = function (method, data, url, async, cb) {
    var req = new XMLHttpRequest();
    req.open(method, url, async);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    //req.responseType = '';
    req.onload = function () {
      if (req.status >= 200 && req.status < 400) {
        models = JSON.parse(req.responseText);
        cb(models);
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

  Constructor.prototype.fetch = function (cb) {
    return this.XHR('GET', null, url, true, cb);
  };

  Constructor.prototype.show = function () {
    return models;
  };

  Constructor.prototype.post = function (data, cb) {
    /* location functionality */
    return this.XHR('POST', data, url, true, cb);
  };

  Constructor.prototype.newFeed = function (loc) {
    console.log('data to newFeed function: ' + JSON.stringify(loc));
    var req = new XMLHttpRequest(),
        url = 'http://localhost:3000/api/v1/feed';
    req.open('POST', url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.onload = function (d) {
      feed = JSON.parse(d.currentTarget.responseText);
      var event = new CustomEvent('feedJSON', {detail: feed});
      document.dispatchEvent(event);
      console.log('got a feed, check it:');
      console.log(App.postman.showFeed());
    };
    req.onerror = function (err) {
      console.log(err)
    };
//    loc.lon = -122;
//    loc.lat = 47;
    var params = "lon="+loc.lon+"&lat="+loc.lat;
    console.log(params);
    req.send(params);
  };

  Constructor.prototype.showFeed = function () {
    return feed;
  };

  return new Constructor();
}
App.postman = new Postman('http://localhost:3000/api/v1/posts');
// Receive the DOM event 'feed-location' and query the
// feed endpoint
document.addEventListener('new-location', function (e) {
  console.log('data to new loc event ' + JSON.stringify(e.detail));
  App.postman.newFeed(e.detail);
});

//global stuff

var messageOut = document.getElementById('message-out');
var posts = document.getElementById('post-display');
var submit = document.getElementById('submit-post');

submit.addEventListener(function (e) {
  console.log(e);
});

App.output = {};
var outList = [];

//rendering

function UI () {

  function Constructor(){};

  Constructor.prototype.appendPost = function(data){
      outList.unshift(data);
  }

  Constructor.prototype.showPosts = function(){

    App.output = App.postman.showFeed();
    for(var i = 0; i<App.output.length; i++){

      //temp assignment of unschematized vals
      App.output[i].tempname = 'battery horse';
      App.output[i].title = 'Your sister ate my lunch';
      //remove above when changing schema

      outList.push({
        title : App.output[i].title,
        tempname: App.output[i].tempname,
        body: App.output[i].body,
        loc: App.output[i].loc
      })
    }
  }



  return new Constructor();

}

App.ui = new UI();


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
      App.ui.appendPost(data);
      console.log('post ok, contents - ' + JSON.stringify(res));
    })
  }, false);

});

document.addEventListener('feedJSON', function(e){
  App.ui.showPosts();
});

//ractive

var fooTemp = "Im a template \
    <ul> \
    {{#list.length}} \
        {{#list:i}} \
        <li> \
          <h2>{{ title }}</h2> \
          {{ body }} \
          By: {{ tempname }} \
          At: {{ loc }} \
        </li> \
        {{/list}} \
    {{/list.length}}";

var ractive = new Ractive({
    el: "#container",
    template: fooTemp,
    data: { list: outList }
});

// console.log(App.output);

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