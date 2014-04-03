'use strict';

FeedPage.prototype = new ContentPage();

function FeedPage() {
	ContentPage.call(this);
	this.element.setAttribute("class", "feedPage");
	this.getContentItems();
}

FeedPage.prototype.getContentItems = function() {
	// the request for the content to display the contents of the navigation drawer
	ajax.makeRequest('/public/views/feedPage.html', this);

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
