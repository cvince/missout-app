ActivityPage.prototype = new ContentPage();

function ActivityPage() {
	ContentPage.call(this);
	this.element.setAttribute("class", "activityPage");
}

ActivityPage.prototype.displayContentItems = function() {
	this.backgroundImage = document.createElement("img");
	this.backgroundImage.setAttribute("class", "activityPageBackground");
	this.backgroundImage.setAttribute("src", "http://placehold.it/40x40");
	this.element.appendChild(this.backgroundImage);
}


ActivityPage.prototype.updateAppBar = function() {
	//controller button
	this.closeButton = new ImageButton("http://placehold.it/40x40");
	this.closeButton.element.setAttribute("class", "appBarButton");
	this.closeButton.onClicked = this.closeButtonClicked;
	this.closeButton.normalStyle = "appBarButton";
	this.closeButton.mouseDownStyle = "appBarButton";
	addElementToDict(this.closeButton.element, this.closeButton);
	this.closeButton.element.style.left = "137rem";
	appBar.setButtons(new Array(this.closeButton));
}

ActivityPage.prototype.switcherButtonClicked = function() {

}

ActivityPage.prototype.closeButtonClicked = function() {
	appCanvas.dismissModal();
}
