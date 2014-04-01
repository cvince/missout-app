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

  page = document.getElementById("body");
  mainContentContainer = document.createElement("div");
  mainContentContainer.setAttribute("id", "mainContentContainer");
  page.appendChild(mainContentContainer);

  utilityBar = new UtilityBar();
  mainContentContainer.appendChild(utilityBar.element);
  mainContentContainer.appendChild(appCanvas.element);
  mainContentContainer.appendChild(appBar.element);
  page.appendChild(navigationDrawer.element);

  //add feed page
  feedPage = new FeedPage();
  appCanvas.pushContent(feedPage);

  splashImage = document.createElement("img");
  splashImage.setAttribute("class", "splashOpen");
  splashImage.setAttribute("src", "/public/images/splash.png");
  setTimeout(function(){
    page.appendChild(this.splashImage);
    setTimeout(splashFadeOut, 1500);
  }, 10);
}

function addElementToDict(element, jsObject) {
  element.setAttribute("guid", elementCount);
  elements[elementCount] = jsObject;
  elementCount++;
}

function initialize() {
  elements = new Object();
  elementCount = 0;
  drawPageElements();
}

function splashFadeOut() {
  splashImage.setAttribute("class", "splashHide");
  setTimeout(splashKill, 700);
}

function splashKill() {
  page.removeChild(splashImage);
}

function clicked(element) {
  elements[element.getAttribute("guid")].clicked();
}

function onMouseDown(element, event) {
  if (element != document) {
      if (elements[element.getAttribute("guid")] != null) {
          elements[element.getAttribute("guid")].onMouseDown(event);
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
    elements[element.getAttribute("guid")].onMouseUp(event);
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
    elements[element.getAttribute("guid")].onMouseMove(event);
  }
}

function onMouseOut(element)
{
  elements[element.getAttribute("guid")].onMouseOut();
}

function transitionCompleted()
{
  elements[this.getAttribute("guid")].transitionCompleted();
}

function onMouseOver(element)
{
  elements[element.getAttribute("guid")].onMouseOver();
}

// document.addEventListener( 'touchstart' , function stopScrolling( touchEvent ) { touchEvent.preventDefault(); } , false );
// document.addEventListener( 'touchmove' , function stopScrolling( touchEvent ) { touchEvent.preventDefault(); } , false );

var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
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
      subString: "Chrome",
      identity: "Chrome"
    },
    {   string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      prop: window.opera,
      identity: "Opera",
      versionSearch: "Version"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    {   // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    {     // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ],
  dataOS : [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
         string: navigator.userAgent,
         subString: "iPhone",
         identity: "iPhone/iPod"
      },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]
};
BrowserDetect.init();

isChromeOrSafari = BrowserDetect.browser == "Safari" || BrowserDetect.browser == "Chrome";


setTimeout(function() {
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
}, 1500);



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
  var userLoc = [],
    lastLoc;
  function constructor () { }
  constructor.prototype.getLoc = function (cb) {
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
  constructor.prototype.locAge = function () {
    return Date.now() - lastLoc;
  };
  constructor.prototype.showLoc = function () {
    return userLoc;
  };
  return new constructor();
};
App.locator = new Locator();
App.locator.getLoc();
/*
-- App.postman --
Handles the fetching, storing and rendering of
all posts. The REST endpoint is passed as an
argument when it is initialized.
 */
function Postman (endpoint) {
  var url = document.URL + endpoint,
    models;
  function constructor () { }
  constructor.prototype.XHR = function (method, data, url, async, cb) {
    var req = new XMLHttpRequest();
    req.open(method, url, async);
    req.responseType = '';
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
    }
    req.send();
  };
  constructor.prototype.fetch = function () {
    return this.XHR('GET', null, url, true, function (data) {
      models = JSON.parse(data);
    });
  };
  constructor.prototype.show = function () {
    return models;
  }
  return new constructor();
}
App.postman = new Postman('api/v1/posts');

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
  var userLoc = [],
    lastLoc;
  function constructor () { }
  constructor.prototype.getLoc = function (cb) {
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
  constructor.prototype.locAge = function () {
    return Date.now() - lastLoc;
  };
  constructor.prototype.showLoc = function () {
    return userLoc;
  };
  return new constructor();
};
App.locator = new Locator();
App.locator.getLoc();
/*
-- App.postman --
Handles the fetching, storing and rendering of
all posts. The REST endpoint is passed as an
argument when it is initialized.
 */
function Postman (endpoint) {
  var url = document.URL + endpoint,
    models;
  function constructor () { }
  constructor.prototype.XHR = function (method, data, url, async, cb) {
    var req = new XMLHttpRequest();
    req.open(method, url, async);
    req.responseType = '';
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
    }
    req.send();
  };
  constructor.prototype.fetch = function () {
    return this.XHR('GET', null, url, true, function (data) {
      models = JSON.parse(data);
    });
  };
  constructor.prototype.show = function () {
    return models;
  }
  return new constructor();
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



