'use strict';

var postPage;
var postCompanion;
var postDeeper;

PostPage.prototype = new ContentPage();

function PostPage() {
	ContentPage.call(this);
	this.element.setAttribute('class', 'postPage');
	// the request for the content to display the contents of the navigation drawer
	ajax.makeRequest('/public/views/fullPostPage.html', this);
}
PostPage.prototype.displayContentItems = function(innerHTML) {
	// EPG content response from the above ajax.makeRequest();
	this.element.innerHTML = innerHTML;
}

PostPage.prototype.postClicked = function() {
	postCompanion = new Companion('/public/views/commentPostPage.html');
	appCanvas.pushContent(postCompanion);
}
PostPage.prototype.postDeeperClicked = function() {
	postDeeper = new Companion('/public/views/postDeeper.html');
	appCanvas.pushContent(postDeeper);
}
