var controller;
Controller.prototype.name = "controller";

function Controller() {
	this.element = document.createElement("div");
	this.element.setAttribute("class", "controller");
	this.drawerOpen = false;
	this.getContentItems();
	this.displayContentItems();
}

Controller.prototype.getContentItems = function() {
	// the request for the content to display the contents of the navigation drawer
	ajax.makeRequest("/public/views/controller.html", this);
}

Controller.prototype.displayContentItems = function(innerHTML) {
	// navigation drawer content response from the above ajax.makeRequest();
	this.element.innerHTML = innerHTML;
}

Controller.prototype.updateAppBar = function() {
	//home button
	this.switcherButton = new ImageButton("/public/images/feed_button.png");
	this.switcherButton.element.setAttribute("class", "appBarButton");
	this.switcherButton.onClicked = this.switcherButtonClicked;
	this.switcherButton.normalStyle = "appBarButton";
	this.switcherButton.mouseDownStyle = "appBarButton";
	addElementToDict(this.switcherButton.element, this.switcherButton);
	this.switcherButton.element.style.left = "140rem";
	//controller button
	this.closeButton = new ImageButton("/public/images/close_button.png");
	this.closeButton.element.setAttribute("class", "appBarButton");
	this.closeButton.onClicked = this.closeButtonClicked;
	this.closeButton.normalStyle = "appBarButton";
	this.closeButton.mouseDownStyle = "appBarButton";
	addElementToDict(this.closeButton.element, this.closeButton);
	this.closeButton.element.style.left = "205rem";
	appBar.setButtons(new Array(this.switcherButton, this.closeButton));
}

Controller.prototype.switcherButtonClicked = function() {

}

Controller.prototype.closeButtonClicked = function() {
	appCanvas.dismissModal();
}
