'use strict';

/* src/js/actions */
/*global App*/

//global stuff

var messageOut = document.getElementById('message-out');
var submit = document.getElementById('submit-post');

submit.addEventListener(function (e) {
  console.log(e);
});

App.output = {};
var outList = [];
var diffList = [];

//rendering

function UI () {

  function Constructor(){}

  Constructor.prototype.appendPost = function(data){
    outList.unshift(data);
  };

  Constructor.prototype.showPosts = function(){

    App.output = App.postman.showFeed();
    for(var i = 0; i<App.output.length; i++){

      //temp assignment of unschematized vals
      App.output[i].tempname = 'battery horse';
      App.output[i].title = 'Your sister ate my lunch';
      //remove above when changing schema

      outList.push({
        title : App.output[i].title,
        tempname: App.output[i].tempname,
        body: App.output[i].body,
        loc: App.output[i].loc
      });
    }
  };

  Constructor.prototype.refreshPosts = function(){

    if(App.output.length > 0){
      console.log(App.output);
      console.log(App.postman.showFeed());
    }
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

submit.disabled = true;

App.locator.getLoc(function (loc) {

  console.log('data to page: ' + JSON.stringify(loc));
  submit.disabled = false;

  submit.addEventListener('click', function() {
    var data = { timestamp : new Date() };
    data.body = messageOut.value.toString();
    data.loc = { type: 'Point', coordinates: [ loc.lon, loc.lat ] };
    App.postman.post(data, function (res) {
      //App.ui.appendPost(data);
      console.log('post ok, contents - ' + JSON.stringify(res));
    });
  }, false);

});



//ractive

var fooTemp = "Im a template \
  <ul> \
  {{#list.length}} \
      {{#list:i}} \
      <li> \
        <h2>{{ title }}</h2> \
        {{ body }} \
        By: {{ tempname }} \
        At: {{ loc }} \
      </li> \
      {{/list}} \
  {{/list.length}}";

var ractive = new Ractive({
  el: '#container',
  template: fooTemp,
  data: { list: outList }
});

// console.log(App.output);
