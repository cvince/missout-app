'use strict';

var controller;
Controller.prototype.name = 'controller';

function Controller() {
	this.element = document.createElement('div');
	this.element.setAttribute('class', 'controller');
	this.drawerOpen = false;
	this.getContentItems();
	//this.displayContentItems();
}

Controller.prototype.getContentItems = function() {
	// the request for the content to display the contents of the navigation drawer
	ajax.makeRequest('/public/views/controller.html', this);
}

Controller.prototype.displayContentItems = function(innerHTML) {
	// navigation drawer content response from the above ajax.makeRequest();
	this.element.innerHTML = innerHTML;


  /*The following is intended to be a bunch of event listeners that track
  post submit click events --comment click event listeners are below,
  and has nothing to do with displayContentItems.

  Please move this, because its location is unintuitive */

  var messageOut = document.getElementById('message-out');
  var titleOut = document.getElementById('title-out');
  var submit = document.getElementById('submit-post');

  submit.addEventListener(function (e) {
    console.log(e);
  });

  App.locator.getLoc(function (loc) {
    submit.addEventListener('click', function() {


  		console.log('data to page: ' + JSON.stringify(loc));

      appCanvas.dismissModal();

      var data = { timestamp : new Date() };
      data.title = titleOut.value.toString();
      data.body = messageOut.value.toString();
      data.loc = { type: 'Point', coordinates: [ loc.lon, loc.lat ] };
      App.postman.post(data, function (res) {
        console.log('post ok, contents - ' + JSON.stringify(res));
      });
    }, false);
  });


}

Controller.prototype.updateAppBar = function() {
	//home button
	this.switcherButton = new ImageButton('/public/images/feed_button.png');
	this.switcherButton.element.setAttribute('class', 'appBarButton');
	this.switcherButton.onClicked = this.switcherButtonClicked;
	this.switcherButton.normalStyle = 'appBarButton';
	this.switcherButton.mouseDownStyle = 'appBarButton';
	addElementToDict(this.switcherButton.element, this.switcherButton);
	this.switcherButton.element.style.left = '108rem';
	//controller button
	this.closeButton = new ImageButton('/public/images/close_button.png');
	this.closeButton.element.setAttribute('class', 'appBarButton');
	this.closeButton.onClicked = this.closeButtonClicked;
	this.closeButton.normalStyle = 'appBarButton';
	this.closeButton.mouseDownStyle = 'appBarButton';
	addElementToDict(this.closeButton.element, this.closeButton);
	this.closeButton.element.style.left = '168rem';
	appBar.setButtons(new Array(this.switcherButton, this.closeButton));
}

Controller.prototype.switcherButtonClicked = function() {

}

Controller.prototype.closeButtonClicked = function() {
	appCanvas.dismissModal();
}


