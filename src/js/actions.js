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


// var data = {

//   // author    : { type: Schema.ObjectId },
//   // body      : {  },
//   // comments  : [ Comment ],
//   // tempname  : { type: String },
//   // tempnames : [{ type: String }]
// };



document.addEventListener('feedJSON', function(e){
  App.ui.showPosts();
});

//ractive

// var fooTemp = "Im a template \
//   <ul> \
//   {{#list.length}} \
//       {{#list:i}} \
//       <li> \
//         <h2>{{ title }}</h2> \
//         Time Since Posted: {{ date }} \
//         {{ body }} \
//         By: {{ tempname }} \
//         At: {{ loc }} \
//       </li> \
//       {{/list}} \
//   {{/list.length}}";

// console.log(App.output);
/**************************actions.js end****************************/
