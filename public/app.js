/******************************start app.js******************************/
'use strict';
/*jslint unused: false*/

window.getID = function(id){return document.getElementById(id);};
window.getClass = function(cl){return document.getElementsByClassName(cl);};

var App = {};

var page;
var splashImage;
var scrollView;
var panel;
var elementCount;
var elements;

var appBar;
var appCanvas;
var utilityBar;
var navigationDrawer;
var mainContentContainer;

var scrolling = false;
var listeningForScrolling = false;
var scrollViewRegister;
var activeScrollViews;
var isMouseDown;

var isChromeOrSafari;
var feedPage;

function drawPageElements() {

	scrollViewRegister = [];
	activeScrollViews = [];
	appBar = new AppBar();
	appCanvas = new AppCanvas();
	navigationDrawer = new NavigationDrawer();

	page = document.getElementById('body');
	mainContentContainer = document.createElement('div');
	mainContentContainer.setAttribute('id', 'mainContentContainer');
	page.appendChild(mainContentContainer);

	utilityBar = new UtilityBar();
	mainContentContainer.appendChild(utilityBar.element);
	mainContentContainer.appendChild(appCanvas.element);
	mainContentContainer.appendChild(appBar.element);
	page.appendChild(navigationDrawer.element);

	//add feed page
	feedPage = new FeedPage();
	appCanvas.pushContent(feedPage);

	splashImage = document.createElement('img');
	splashImage.setAttribute('class', 'splashOpen');
	splashImage.setAttribute('src', '/public/images/splash.png');
	setTimeout(function(){
		page.appendChild(this.splashImage);
		setTimeout(splashFadeOut, 500);
	}, 100);

}

function addElementToDict(element, jsObject) {
	element.setAttribute('guid', elementCount);
	elements[elementCount] = jsObject;
	elementCount++;
}

function refreshFeed() {
  App.locator.getLoc(function(userLoc){
    var event = new CustomEvent('start-feed', { detail: userLoc });
    document.dispatchEvent(event);
  });
}

function initialize() {
	refreshFeed();
	elements = {};
	elementCount = 0;
	drawPageElements();
	setTouchListeners();

  var messageOut = document.getElementById('message-out');
  var titleOut = document.getElementById('title-out');
  var submit = document.getElementById('submit-post');

  submit.addEventListener(function (e) {
    console.log(e);
  });

  submit.setAttribute('disabled', true);

  messageOut.onkeyup = function(){

  	if(messageOut.value.length>0){
  		submit.removeAttribute('disabled');
  	}else{
  		submit.setAttribute('disabled', true);
  	}

  };

  submit.addEventListener('click', function() {

		App.locator.getLoc(function (loc) {

			console.log('data to page: ' + JSON.stringify(loc));

      var data = { timestamp : new Date() };
      data.title = titleOut.value.toString();
      data.body = messageOut.value.toString();
      data.loc = { type: 'Point', coordinates: [ loc.lon, loc.lat ] };
      App.postman.post(data, function (res) {
        console.log('post ok, contents - ' + JSON.stringify(res));

			  var postModal = document.getElementById('postModal');
	      postModal.setAttribute('class', '');
	      postModal.setAttribute('class', 'contentAreaModalUp');

				document.getElementById('submit-post-form').reset();

	      setTimeout(refreshFeed, 1000);
      });

		});

  }, false);

}

function splashFadeOut() {
	splashImage.setAttribute('class', 'splashHide');
	setTimeout(splashKill, 700);
}

function splashKill() {
	page.removeChild(splashImage);
}

function clicked(element) {
	elements[element.getAttribute('guid')].clicked();
}

function onMouseDown(that, event) {
	var element = that.element;
	if (element != document) {
		if (elements[element.getAttribute('guid')] !== null) {
			elements[element.getAttribute('guid')].onMouseDown(element, event);
		}
	}
	else {

	}
}

function onMouseUp(that, event)
{
	var element = that.element;
	if (element == document) {
		scrollView.onMouseUp(event);
	}
	else {
		elements[element.getAttribute('guid')].onMouseUp(event);
	}

	for (var item in elements) {
		if (elements[item] instanceof Button && !elements[item].multiSelect) {
			elements[item].isMouseDown = false;
		}
	}
	for (var scrollV in scrollViewRegister) {
		scrollViewRegister[scrollV].onMouseUp(event);
	}

	scrollViewRegister = new Array();
	activeScrollViews = new Array();
	activeButton = null;
}

function onMouseMove(element, event) {
	if (element == document) {
		for (var scrollV in activeScrollViews) {
			activeScrollViews[scrollV].onMouseMove(event);
		}
	}
	else {
		elements[element.getAttribute('guid')].onMouseMove(event);
	}
}

function onMouseOut(element)
{
	elements[element.getAttribute('guid')].onMouseOut();
}

function transitionCompleted()
{
	elements[this.getAttribute('guid')].transitionCompleted();
}

function onMouseOver(element)
{
	elements[element.getAttribute('guid')].onMouseOver();
}

// document.addEventListener( 'touchstart' , function stopScrolling( touchEvent ) { touchEvent.preventDefault(); } , false );
// document.addEventListener( 'touchmove' , function stopScrolling( touchEvent ) { touchEvent.preventDefault(); } , false );

function setTouchListeners() {
	document.body.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
	document.getElementById('navigationDrawer').addEventListener('touchmove', function(e) { e.stopPropagation(); }, false);
	document.getElementById('appCanvas').addEventListener('touchmove', function(event){ event.stopPropagation(); }, false);
}

/******************************end app.js******************************/

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

  return new Constructor();
}

App.locator = new Locator();

/**************************locator.js end****************************/
/*******************postman.js start***********************/
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
        //models = JSON.parse(req.responseText);
        cb(models);
      } else {
        return false;
      }
    };
    req.onerror = function (err) {
      console.log('XHR Error: ' + JSON.stringify(err));
    };
    if (data) {
      console.log('bad data: ' + JSON.stringify(data));
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
    return this.XHR('POST', data, url, false, cb);
  };

  Constructor.prototype.comment = function (data, id, cb) {
    return this.XHR('POST', data, document.URL + 'api/v1/comments/' + id, true, cb);
  };

  Constructor.prototype.newFeed = function (loc) {
    console.log('data to newFeed function: ' + JSON.stringify(loc));
    var req = new XMLHttpRequest(),
        url = document.URL + 'api/v1/feed';
    req.open('POST', url, true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onload = function (d) {
      feed = JSON.parse(d.currentTarget.responseText);
      console.log('got a feed, check it:');
      models = feed;
      var event = new CustomEvent('feedJSON', {detail: feed});
      document.dispatchEvent(event);
      //console.log(App.postman.showFeed());
    };
    req.onerror = function (err) {
      console.log(err);
    };
//    loc.lon = -122;
//    loc.lat = 47;
    var params = 'lon='+loc.lon+'&lat='+loc.lat;
    console.log(params);
    req.send(params);
  };

  Constructor.prototype.showFeed = function () {
    return feed;
  };

  return new Constructor();
}
App.postman = new Postman(document.URL + 'api/v1/posts');



// Receive the DOM event 'feed-location' and query the
// feed endpoint
document.addEventListener('start-feed', function (e) {
  console.log('data to new loc event ' + JSON.stringify(e.detail));
  App.postman.newFeed(e.detail);
});

/**************************postman.js end****************************/

/*******************heartbeat.js start***********************/
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
/**************************heartbeat.js end****************************/
