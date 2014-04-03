'use strict';
/* src/js/ui */
/*global App*/


/*
-- App.ui --
Passes data into helper functions that
initiate UI render/redraw events.

*/

//global selectors

var messageOut = document.getElementById('message-out');
var titleOut = document.getElementById('title-out');
var postSubmit = document.getElementById('submit-post');

postSubmit.addEventListener(function (e) {
  console.log(e);
});

App.output = {};
var outList = [];
//rendering

function UI () {

  function Constructor(){}

  // ui feed display functions

  Constructor.prototype.showFeed = function(){
    for (var post in outList) {
      outList.pop();
    }
    App.output = App.postman.showFeed();
    for(var i = 0; i<App.output.length; i++){

      //temp assignment of unschematized vals
      //App.output[i].tempname = 'battery horse';
      App.output[i].title = 'Your sister ate my lunch';
      //remove above when changing schema

      outList.push({
        date : App.output[i].timestamp,
        title : App.output[i].title,
        tempname: App.output[i].tempname,
        body: App.output[i].body,
        loc: App.output[i].loc
      });
    }
  };

  Constructor.prototype.appendFeed = function(data){
    outList.unshift(data);
  };

  Constructor.prototype.refreshFeed = function(){
    for (var post in outList) {
      outList.pop();
    }
    App.locator.getLoc();
  };


  // ui comment display functions


  Constructor.prototype.showComment = function(postId){

  }

  Constructor.prototype.appendComment = function(postId){

  }

  Constructor.prototype.refreshComment = function(postId){

  }

  // ui posting functions

  Constructor.prototype.makePost = function(){
    var data = { timestamp : new Date() };
    data.title = titleOut.value.toString();
    data.body = messageOut.value.toString();
    data.loc = { type: 'Point', coordinates: [ loc.lon, loc.lat ] };
    App.postman.post(data, function (res) {
      App.ui.appendFeed(data);
      console.log('post ok, contents - ' + JSON.stringify(res));
    });
  }

  Constructor.prototype.makeComment = function(postId){
    var data = { timestamp : new Date() };
    data.body = document.getElementById('post-'+postId.toString()).value.toString();
    // App.postman.postComment(data, function (res) {
    //   App.ui.appendComment(postId);
    //   console.log('content ok, contents - ' + JSON.stringify(res));
    // });
  }

  return new Constructor();

}


App.ui = new UI();

/* App.ui end */
