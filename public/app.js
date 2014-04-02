'use strict';

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
  scrollViewRegister = new Array();
  activeScrollViews = new Array();
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
    setTimeout(splashFadeOut, 1500);
  }, 100);
}

function addElementToDict(element, jsObject) {
  element.setAttribute('guid', elementCount);
  elements[elementCount] = jsObject;
  elementCount++;
}

function initialize() {
  elements = new Object();
  elementCount = 0;
  drawPageElements();
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

function onMouseDown(element, event) {
  if (element != document) {
      if (elements[element.getAttribute('guid')] != null) {
          elements[element.getAttribute('guid')].onMouseDown(event);
      }
  }
  else {

  }
}

function onMouseUp(element, event)
{
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

var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || 'An unknown browser';
    this.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || 'an unknown version';
    this.OS = this.searchString(this.dataOS) || 'an unknown OS';
  },
  searchString: function (data) {
    for (var i=0;i<data.length;i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      }
      else if (dataProp)
        return data[i].identity;
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
  },
  dataBrowser: [
    {
      string: navigator.userAgent,
      subString: 'Chrome',
      identity: 'Chrome'
    },
    {   string: navigator.userAgent,
      subString: 'OmniWeb',
      versionSearch: 'OmniWeb/',
      identity: 'OmniWeb'
    },
    {
      string: navigator.vendor,
      subString: 'Apple',
      identity: 'Safari',
      versionSearch: 'Version'
    },
    {
      prop: window.opera,
      identity: 'Opera',
      versionSearch: 'Version'
    },
    {
      string: navigator.vendor,
      subString: 'iCab',
      identity: 'iCab'
    },
    {
      string: navigator.vendor,
      subString: 'KDE',
      identity: 'Konqueror'
    },
    {
      string: navigator.userAgent,
      subString: 'Firefox',
      identity: 'Firefox'
    },
    {
      string: navigator.vendor,
      subString: 'Camino',
      identity: 'Camino'
    },
    {   // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: 'Netscape',
      identity: 'Netscape'
    },
    {
      string: navigator.userAgent,
      subString: 'MSIE',
      identity: 'Explorer',
      versionSearch: 'MSIE'
    },
    {
      string: navigator.userAgent,
      subString: 'Gecko',
      identity: 'Mozilla',
      versionSearch: 'rv'
    },
    {     // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: 'Mozilla',
      identity: 'Netscape',
      versionSearch: 'Mozilla'
    }
  ],
  dataOS : [
    {
      string: navigator.platform,
      subString: 'Win',
      identity: 'Windows'
    },
    {
      string: navigator.platform,
      subString: 'Mac',
      identity: 'Mac'
    },
    {
         string: navigator.userAgent,
         subString: 'iPhone',
         identity: 'iPhone/iPod'
      },
    {
      string: navigator.platform,
      subString: 'Linux',
      identity: 'Linux'
    }
  ]
};
BrowserDetect.init();

isChromeOrSafari = BrowserDetect.browser == 'Safari' || BrowserDetect.browser == 'Chrome';

setTimeout(function(){
  var elem = document.querySelector('[id^=post-]');
  window.mySwipe = Swipe(elem, {
    startSlide: 1,
    //auto: 3000,
    continuous: false,
    disableScroll: false,
    stopPropagation: true,
    callback: function(index, element) {},
    transitionEnd: function(index, element) {}
  });

  var elem = document.querySelector('[id^=post-]');
  var bullets = document.querySelector('[id^=pagination-]').getElementsByTagName('li');

  window.mySwipe = Swipe(elem, {
    continuous: true,
    callback: function(pos) {
      var i = bullets.length;
      while (i--) {
        bullets[i].className = ' ';
      }
      bullets[pos].className = 'on';
    }
  });
}, 1200);

document.body.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
//document.getElementById('navigationDrawer').addEventListener('touchmove', function(e) { e.stopPropagation(); }, false);
//document.getElementById('appCanvas').addEventListener('touchmove', function(event){ event.stopPropagation(); }, false);
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
      var event = new CustomEvent('feedJSON', feed);
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



<<<<<<< HEAD
'use strict';
=======
//global stuff
>>>>>>> sessions

var messageOut = document.getElementById('message-out');
var posts = document.getElementById('post-display');
var submit = document.getElementById('submit-post');

<<<<<<< HEAD
// submit.addEventListener(function (e) {
//   console.log(e);
// });

// var data =  {
//   timestamp : new Date()
//   // author    : { type: Schema.ObjectId },
//   // body      : {  },
//   // comments  : [ Comment ],
//   // tempname  : { type: String },
//   // tempnames : [{ type: String }]
// };

// submit.disabled = true;

// App.locator.getLoc(function (loc) {
//   console.log('data to page: ' + JSON.stringify(loc));
//   submit.disabled = false;
//   submit.addEventListener('click', function() {
//     var data = {};
//     data.body = messageOut.value.toString();
//     data.loc = { type: "Point", coordinates: [ loc.lon, loc.lat ] };
//     App.postman.post(data, function (res) {
//       console.log('post ok, contents - ' + JSON.stringify(res));
//     })
//   }, false);

// });
=======
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






// //rendering

// function UI () {

//   App.output = {};

//   function Constructor(){};

//   Constructor.prototype.appendPost = function(){

//   }

//   Constructor.prototype.refreshPosts = function(endpoint){
//     App.postman.fetch(function(endpoint){
//       App.output = endpoint;
//     });
//   }

//   return new Constructor();

// }

// App.ui = new UI();

// App.ui.refreshPosts('api/v1/posts');

var fooTemp = "Im a template \
    {{#list}} \
        {{.}} \
    {{/list}}";

var ractive = new Ractive({
    el: "#container",
    template: fooTemp,
    data: { list: ['a', 'b', 'c'] }
});

console.log(App.output);

>>>>>>> sessions
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