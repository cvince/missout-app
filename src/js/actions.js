/*******************actions.js start***********************/
'use strict';
/* src/js/actions */
/*global App*/

//global stuff


App.output = {};
var outList = [];
//rendering

function UI () {

  function Constructor(){}

  Constructor.prototype.appendPost = function(data){
    outList.unshift(data);
  };

  Constructor.prototype.showPosts = function(){
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
        id : App.output[i]._id,
        date : App.output[i].timestamp,
        title : App.output[i].title,
        tempname: App.output[i].tempname,
        body: App.output[i].body,
        loc: App.output[i].loc
      });
    }
  };

  Constructor.prototype.refreshPosts = function(){
    for (var post in outList) {
      outList.pop();
    }
    App.locator.getLoc();
  };

  return new Constructor();

}

App.ui = new UI();


/**************************actions.js end****************************/
