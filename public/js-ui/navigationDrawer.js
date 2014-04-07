'use strict';
/*global json2html*/

function NavigationDrawer() {
	this.element = document.createElement('div');
	this.element.setAttribute('id', 'navigationDrawer');
	this.element.setAttribute('class', 'navigationDrawerClosed');
	this.drawerOpen = false;
	this.getContentItems();
}

NavigationDrawer.prototype.getContentItems = function() {
	// the request for the content to display the contents of the navigation drawer
	//ajax.makeRequest('/public/views/navigationDrawer.html', this);
};

NavigationDrawer.prototype.displayContentItems = function(alerts, tracked) {
	// navigation drawer content response from the above ajax.makeRequest();
	function generateMainTemplate(){
		return {
			tag: 'section',
			class: 'scrollable',
			id: 'messageCenter',
			children: [
				{tag: 'h2',
				class: 'box-effect',
				html: 'alerts'},
				{tag: 'ul',
				children: function(){ return(json2html.transform(this.tracked, commentMicroTemplate())); }},
				{tag: 'h2',
				class: 'box-effect',
				html: 'tracked'},
				{tag: 'ul',
				children: function(){ return(json2html.transform(this.alerts, commentMicroTemplate())); }
				}
			]
		};
	}

	function commentMicroTemplate(){
		return{
			tag: 'li',
			//html: '${body}',
			children: [
				{tag: 'p',
				children:[
					{tag: 'date',
					datetime: '${date}'}
				]},
				{tag: 'p',
				children: [
					{tag: 'a',
					html: '${title}'}
				]}
			]
		};
	}

	var template = generateMainTemplate();
	//this.element.innerHTML = innerHTML;
	this.element.innerHTML = json2html.transform({alerts: alerts, tracked: tracked}, template);
};

NavigationDrawer.prototype.homeButtonClicked = function() {
	navigationDrawer.close();
	appCanvas.pushContent(feedPage);
};

NavigationDrawer.prototype.open = function()
{
	navigationDrawer.element.style.left = '';
	mainContentContainer.style.left = '';
	navigationDrawer.element.setAttribute('class', 'navigationDrawerOpen scrollable');
	mainContentContainer.setAttribute('id', 'mainContentContainerWithDrawerOpen');
	this.drawerOpen = true;
};

NavigationDrawer.prototype.close = function()
{
	navigationDrawer.element.style.left = '';
	mainContentContainer.style.left = '';
	navigationDrawer.element.setAttribute('class', 'navigationDrawerClosed');
	mainContentContainer.setAttribute('id', 'mainContentContainer');
	this.drawerOpen = false;
};
