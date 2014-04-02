'use strict';

FeedPage.prototype = new ContentPage();

function FeedPage() {
	ContentPage.call(this);
	this.element.setAttribute("class", "feedPage");
	// request the data and place in _element_
	ajax.makeRequest("/public/views/feedPage.html", this);
}

FeedPage.prototype.displayContentItems = function(innerHTML) {
	//the data response from the above request
	this.element.innerHTML = innerHTML;
}

FeedPage.prototype.updateUtilityBar = function() {
	utilityBar.showDrawerButton();
}

FeedPage.prototype.bottomButtonClicked = function() {
	catalog = new Catalog();
	appCanvas.pushContent(catalog);
}

FeedPage.prototype.postPageButtonClicked = function() {
	navigationDrawer.close();
	postPage = new PostPage();
	appCanvas.pushContent(postPage);
}
