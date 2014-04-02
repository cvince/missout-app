'use strict';

function NavigationDrawer() {
	this.element = document.createElement('div');
	this.element.setAttribute('id', 'navigationDrawer');
	this.element.setAttribute('class', 'navigationDrawerClosed');
	this.drawerOpen = false;
	this.getContentItems();
}

NavigationDrawer.prototype.getContentItems = function() {
	// the request for the content to display the contents of the navigation drawer
	ajax.makeRequest('/public/views/navigationDrawer.html', this);
}

NavigationDrawer.prototype.displayContentItems = function(innerHTML) {
	// navigation drawer content response from the above ajax.makeRequest();
	this.element.innerHTML = innerHTML;
}

NavigationDrawer.prototype.homeButtonClicked = function() {
	navigationDrawer.close();
	appCanvas.pushContent(feedPage);
}

NavigationDrawer.prototype.open = function()
{
	navigationDrawer.element.style.left = '';
	mainContentContainer.style.left = '';
	navigationDrawer.element.setAttribute('class', 'navigationDrawerOpen scrollable');
	mainContentContainer.setAttribute('id', 'mainContentContainerWithDrawerOpen');
	this.drawerOpen = true;
}

NavigationDrawer.prototype.close = function()
{
	navigationDrawer.element.style.left = '';
	mainContentContainer.style.left = '';
	navigationDrawer.element.setAttribute('class', 'navigationDrawerClosed');
	mainContentContainer.setAttribute('id', 'mainContentContainer');
	this.drawerOpen = false;
}
