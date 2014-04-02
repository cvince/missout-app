var companion;
Companion.prototype = new ContentPage();

function Companion(url) {
	ContentPage.call(this);
	this.element.setAttribute('class', 'companionPage');
	// the request for the content to display the contents of the navigation drawer
	ajax.makeRequest(url, this);
}

Companion.prototype.displayContentItems = function(innerHTML) {
	// EPG content response from the above ajax.makeRequest();
	this.element.innerHTML = innerHTML;
}
