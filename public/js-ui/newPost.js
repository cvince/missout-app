'use strict';
/*global json2html*/
/*global App*/
/*global UI*/
/*global getID*/

UI.NewPost = function(elem){
  var element = elem;
  var messageOut = getID('message-out');
  var titleOut = getID('title-out');
  var submit = getID('submit-post');

  messageOut.onkeyup = function(){
    if(messageOut.value.length>0){
      submit.removeAttribute('disabled');
    }else{
      submit.setAttribute('disabled', true);
    }
  };

  submit.addEventListener('click', function() {
    App.locator.getLoc(function(userLoc){newPostLocation(userLoc);});
  }, false);

  var newPostLocation = function (loc) {
    console.log('data to page: ' + JSON.stringify(loc));

    var data = { timestamp : new Date() };
    data.title = titleOut.value.toString();
    data.body = messageOut.value.toString();
    data.loc = { type: 'Point', coordinates: [ loc.lon, loc.lat ] };
    App.postman.post(data, function (res) {
      App.postman.insert(data);
      console.log('post ok, contents - ' + JSON.stringify(res));
      var postModal = document.getElementById('postModal');
      postModal.setAttribute('class', '');
      postModal.setAttribute('class', 'contentAreaModalUp');
      document.getElementById('submit-post-form').reset();
      location.reload();
      setTimeout(function(){
        var reloadFeed = new CustomEvent('reloadFeed', {});
        document.dispatchEvent(reloadFeed);
      }, 1000);
    });
  };
};

document.addEventListener('feedJSON', function(){

})

UI.NewComment = function(){

  //App.postman.comment(data, )
}
