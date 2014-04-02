'use strict';

var messageOut = document.getElementById('message-out');
var posts = document.getElementById('post-display');
var submit = document.getElementById('submit-post');

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