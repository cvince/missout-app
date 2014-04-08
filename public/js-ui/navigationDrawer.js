'use strict';
/*global json2html*/
/*global UI*/
/*global App*/

UI.NavigationDrawer = function(elem) {
	var element = elem;
	document.addEventListener('refillNavDrawer', function(e){
		displayContentItems(e.detail.alerts, e.detail.tracked);
	});

	var displayContentItems = function(alerts, tracked) {
		element.innerHTML = json2html.transform({alerts: alerts, tracked: tracked}, mainTemplate);
		var trackedRoot = element.children[0].children[1].children;
		var alertsRoot = element.children[0].children[3].children;
		var rep;

		//add click handlers to drawer items
		for(rep=0;rep<trackedRoot.length;rep++){
			trackedRoot[rep].children[1].addEventListener('click', itemClicked);
		}
		for(rep=0;rep<alertsRoot.length;rep++){
			alertsRoot[rep].children[1].addEventListener('click', itemClicked);
		}
		// var event = new CustomEvent('new-location', { detail: {alerts: alerts, tracked: tracked}});
		// document.dispatchEvent(event);
	};

	var itemClicked = function(e){
		//alert(e.currentTarget.dataset.id);
		var postList = App.postman.show();
		var thisPost = {};
		var _id = e.currentTarget.dataset.id;
		for(var rep=0;rep<postList.length;rep++){
			if(postList[rep]._id === _id){
				thisPost = postList[rep];
			}
		}
		//in case there is no match, just grab first post in feed
		if(thisPost === {}) {thisPost = postList[0];}

		var postExpanded = new CustomEvent('postExpanded', {detail: thisPost});
		document.dispatchEvent(postExpanded);

		var toggleNavDrawer = new CustomEvent('toggleNavDrawer', {});
		document.dispatchEvent(toggleNavDrawer);
	};

	var mainTemplate = {
		tag: 'section',
		class: 'scrollable',
		id: 'messageCenter',
		children: [
			{tag: 'h2',
			class: 'box-effect',
			html: 'alerts'},
			{tag: 'ul',
			children: function(){ return(json2html.transform(this.tracked, commentMicroTemplate)); }},
			{tag: 'h2',
			class: 'box-effect',
			html: 'tracked'},
			{tag: 'ul',
			children: function(){ return(json2html.transform(this.alerts, commentMicroTemplate)); }
			}
		]
	};

	var commentMicroTemplate = {
		tag: 'li',
		//html: '${body}',
		children: [
			{tag: 'p',
			children:[
				{tag: 'date',
				datetime: '${date}'}
			]},
			{tag: 'p',
			'data-id': '${_id}',
			children: [
				{tag: 'a',
				html: '${title}'}
			]}
		]
	};
};

