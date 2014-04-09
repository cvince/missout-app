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

	document.addEventListener('toggleModal', function(){toggleModal();});

	var toggleModal = function(){
		if(getID('postModal').className === 'contentAreaModalUp'){
			getID('postModal').className = 'contentAreaModalDown';
		} else {
			getID('postModal').className = 'contentAreaModalUp';
		}
	};

	document.addEventListener('feedJSON', function(e){
		var reloadFeed = new CustomEvent('reloadFeed', {});
		document.dispatchEvent(reloadFeed);
	});

	// var toggleCheckboxes = function() {
	// 	var upVote = document.querySelectorAll('.vote .upvote');
	// 	var downVote = document.querySelectorAll('.vote .downvote');
	// 	downVote.onclick(function() {
	// 		console.log('downVote clicked');
	// 		if(this.checked) {
	// 			document.formName.upVote.checked=false;
	// 		}
	// 	});
	// 	upVote.onclick(function() {
	// 		console.log('upVote clicked');
	// 		if(this.checked) {
	// 			document.formName.downVote.checked=false;
	// 		}
	// 	});
	// };
	// toggleCheckboxes();

};
