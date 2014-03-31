'use strict';

var App = {};

/* location functionality */


console.log(App.locator.getLoc());


App.postman.XHR('POST', {}, 'api/v1/posts',function(){
  console.log('posted');
})


