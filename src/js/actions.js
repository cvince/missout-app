var messageOut = document.getElementById('message-out');
var posts = document.getElementById('post-display');
var submit = document.getElementById('submit-post');

var data =  {
  timestamp : new Date(),
  // author    : { type: Schema.ObjectId },
  // body      : {  },
  // comments  : [ Comment ],
  // tempname  : { type: String },
  // tempnames : [{ type: String }]
}

submit.addEventListener('click', function() {
  data.body = messageOut.value.toString();


  App.locator.getLoc(function (loc) {
    data.loc = loc;
    App.postman.post(data, function (res) {
      console.log('post ok to ' + res);
    })
  });

}, false);


messageOut.addEventListener('keypress', function (e) {
  var key = e.which || e.keyCode;
  if (key == 13) { // 13 is enter
    submit.click();
  }
});
