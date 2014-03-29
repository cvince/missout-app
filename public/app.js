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
    };
    if (data) {
      req.send(data);
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



