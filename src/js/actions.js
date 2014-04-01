//global stuff

var messageOut = document.getElementById('message-out');
var posts = document.getElementById('post-display');
var submit = document.getElementById('submit-post');

submit.addEventListener(function (e) {
  console.log(e);
});

var data =  {
  timestamp : new Date()
  // author    : { type: Schema.ObjectId },
  // body      : {  },
  // comments  : [ Comment ],
  // tempname  : { type: String },
  // tempnames : [{ type: String }]
};

submit.disabled = true;

App.locator.getLoc(function (loc) {
  console.log('data to page: ' + JSON.stringify(loc));
  submit.disabled = false;
  submit.addEventListener('click', function() {
    var data = {};
    data.body = messageOut.value.toString();
    data.loc = { type: "Point", coordinates: [ loc.lon, loc.lat ] };
    App.postman.post(data, function (res) {
      console.log('post ok, contents - ' + JSON.stringify(res));
    })
  }, false);

});






//rendering

function UI () {

  App.output = {};

  function Constructor(){};

  Constructor.prototype.appendPost = function(){

  }

  Constructor.prototype.refreshPosts = function(endpoint){
    App.postman.fetch(function(endpoint){
      App.output = endpoint;
    });
  }

  return new Constructor();

}

App.ui = new UI();

App.ui.refreshPosts('api/v1/posts');

var fooTemp = "Im a template \
    {{#list}} \
        {{.}} \
    {{/list}}";

var ractive = new Ractive({
    el: "#container",
    template: fooTemp,
    data: { list: ['a', 'b', 'c'] }
});

console.log(App.output);
