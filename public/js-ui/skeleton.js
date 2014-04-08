'use strict';
/*global App*/
/*global UI*/
/*global getID*/
/*global FeedPage*/
/*global NavigationDrawer*/
/*global json2html*/

/*jslint unused: false*/

UI.Skeleton = function(){
	var elem = window.getID('body');
	elem.innerHTML += json2html.transform({}, skeletonMainTemplate);
	elem.innerHTML += json2html.transform({}, skeletonNavTemplate);
	eventHandlers();

	var feedPage = new UI.FeedPage(getID('feedDrawer'));
	var navigationDrawer = new UI.NavigationDrawer(getID('navigationDrawer'));
	var postPage = new UI.PostPage(getID('postDrawer'));
};

function eventHandlers(){
	getID('navigationDrawer').addEventListener('touchmove', function(e) { e.stopPropagation(); }, false);
	getID('appCanvas').addEventListener('touchmove', function(event){ event.stopPropagation(); }, false);

	getID('navTemplateToggleButton').addEventListener('click', function(){
		var toggleNavDrawer = new CustomEvent('toggleNavDrawer', {});
		document.dispatchEvent(toggleNavDrawer);
	});

	getID('returnToFeedButton').addEventListener('click', function(){
		var toggleNavDrawer = new CustomEvent('toggleNavDrawer', {});
		document.dispatchEvent(toggleNavDrawer);
		var feedMode = new CustomEvent('feedMode', {});
		document.dispatchEvent(feedMode);
	});
}

var skeletonMainTemplate = {
	tag: 'div',
	id: 'mainDrawer',
	class: 'mainContentContainer',
	children:[
		{tag: 'div',
		id: 'utilityBar',
		class: 'utilityBar',
		children: [
			{tag: 'div',
			class: 'utilityBarDrawerButton',
			id: 'navTemplateToggleButton',
			children: [
				{tag: 'img',
				class: 'image',
				draggable: 'false',
				src: '/public/images/x.png'}
			]},
			{tag: 'div',
			class: 'utilityBarDrawerButton',
			id: 'returnToFeedButton',
			style: 'left: 50rem; display: none;',
			children: [
				{tag: 'img',
				class: 'image',
				draggable: 'false',
				src: '/public/images/x.png'}
			]}
		]},
		{tag: 'div',
		id: 'appCanvas',
		class: 'appCanvas scrollable',
		children: [
			{tag: 'div',
			id: 'feedDrawer'},
			{tag: 'div',
			id: 'postDrawer'},
			{tag: 'div',
			id: 'chatDrawer'}
		]},
		{tag: 'div',
		id: 'appBar',
		children: [
			// {tag: 'img',
			// class: 'appBarBackground',
			// src: '/public/images/close_button.png'},
			{tag: 'div',
			class: 'appBarButtonContainer',
			children: [
				{tag: 'div',
				class: 'appBarButton',
				style: 'left: 108rem;',
				id: 'optionsButton',
				children: [
					{tag: 'img',
					class: 'image',
					draggable: 'false',
					src: '/public/images/feed_button.png'}
				]},
				{tag: 'div',
				class: 'appBarButton',
				style: 'left: 168rem;',
				id: 'newPostButton',
				children: [
					{tag: 'img',
					class: 'image',
					draggable: 'false',
					src: '/public/images/controller_button.png'}
				]}
			]}
		]}
	]
};

var skeletonNavTemplate = {
	tag: 'div',
	id: 'navigationDrawer',
	class: 'navigationDrawerClosed',
	children: [
		{tag: 'section',
		id: 'messageCenter',
		class: 'scrollable',
		children: [
			{tag: 'h2',
			class: 'box-effect',
			html: 'alerts'},
			{tag: 'ul',
			id: 'navAlerts'},
			{tag: 'h2',
			class: 'box-effect',
			html: 'tracked'},
			{tag: 'ul',
			id: 'navTracked'}
		]}
	]
};

