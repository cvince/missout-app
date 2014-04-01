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
    if (data) {
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

  return new Constructor();
}
App.postman = new Postman('api/v1/posts');

App.foo = function() {
  var url = document.URL + 'api/v1/posts';
  var req = new XMLHttpRequest();
  var cb = function(data){
    console.log(JSON.parse(data));
    return JSON.parse(data);
  };
  req.open('POST', url, true);
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  req.send(JSON.stringify({name:'John Rambo', time:'2pm'}));
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
};


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



