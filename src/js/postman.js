'use strict';
/*global App*/

/*
-- App.postman --
Handles the fetching, storing and rendering of
all posts. The REST endpoint is passed as an
argument when it is initialized.
 */
function Postman (endpoint) {
  var url = endpoint,
      models;
  function Constructor () { }
  Constructor.prototype.XHR = function (method, data, url, async, cb) {
    var req = new XMLHttpRequest();
    req.open(method, url, async);
    req.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    req.responseType = '';
    req.onload = function () {
      if (req.status >= 200 && req.status < 400) {
        models = JSON.parse(req.responseText);
        cb(models);
      } else {
        return false;
      }
    };
    if (data) {
      console.log(data);
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

  Constructor.prototype.post = function(data, cb){
    /* location functionality */
    return this.XHR('POST', data, url, true, cb);

  }

  return new Constructor();
}
App.postman = new Postman('http://localhost:3000/api/v1/posts');


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



