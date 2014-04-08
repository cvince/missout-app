'use strict';
/*global App*/
/*global UI*/
/*global getID*/
/*global FeedPage*/
/*global json2html*/

/*jslint unused: false*/

UI.Control = function(){
	document.addEventListener('toggleNavDrawer', function(){toggleNavDrawer();});

	var toggleNavDrawer = function(){
		var navDrawer = getID('navigationDrawer');
		var mainDrawer = getID('mainDrawer');
		if(mainDrawer.className === 'mainContentContainer'){
			mainDrawer.className = 'mainContentContainerWithDrawerOpen';
			navDrawer.className = 'navigationDrawerOpen scrollable';
		} else {
			mainDrawer.className = 'mainContentContainer';
			navDrawer.className = 'navigationDrawerClosed';
		}
	};

	document.addEventListener('feedMode', function(){feedMode();});

	var feedMode = function(){
		var feedDrawer = getID('feedDrawer');
		var postDrawer = getID('postDrawer');
		var chatDrawer = getID('chatDrawer');
		var returnToFeedButton = getID('returnToFeedButton');

		feedDrawer.style.display = '';
		postDrawer.style.display = 'none';
		chatDrawer.style.display = 'none';
		returnToFeedButton.style.display = 'none';
	};

	document.addEventListener('postMode', function(){postMode();});

	var postMode = function(){
		var feedDrawer = getID('feedDrawer');
		var postDrawer = getID('postDrawer');
		var chatDrawer = getID('chatDrawer');
		var returnToFeedButton = getID('returnToFeedButton');

		feedDrawer.style.display = 'none';
		postDrawer.style.display = '';
		chatDrawer.style.display = 'none';
		returnToFeedButton.style.display = '';
	};

	document.addEventListener('chatMode', function(){chatMode();});

	var chatMode = function(){
		var feedDrawer = getID('feedDrawer');
		var postDrawer = getID('postDrawer');
		var chatDrawer = getID('chatDrawer');
		var returnToFeedButton = getID('returnToFeedButton');

		feedDrawer.style.display = 'none';
		postDrawer.style.display = 'none';
		chatDrawer.style.display = '';
	};

	document.addEventListener('showModal', function(){showModal();});

	var showModal = function(){
		getID('postModal').className = 'contentAreaModalDown';
	};
};
