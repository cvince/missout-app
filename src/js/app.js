/******************************start app.js******************************/
'use strict';
/*jslint unused: false*/

var App = {};

var page;
var splashImage;
var scrollView;
var panel;
var elementCount;
var elements;

var appBar;
var appCanvas;
var utilityBar;
var navigationDrawer;
var mainContentContainer;

var scrolling = false;
var listeningForScrolling = false;
var scrollViewRegister;
var activeScrollViews;
var isMouseDown;

var isChromeOrSafari;
var feedPage;

var getID = function(id){
  return document.getElementById(id);
}

var getClass = function(cl){
  return document.getElementsByClassName(cl);
}

function drawPageElements() {
	scrollViewRegister = [];
	activeScrollViews = [];
	appBar = new AppBar();
	appCanvas = new AppCanvas();
	navigationDrawer = new NavigationDrawer();

	page = document.getElementById('body');
	mainContentContainer = document.createElement('div');
	mainContentContainer.setAttribute('id', 'mainContentContainer');
	page.appendChild(mainContentContainer);

	utilityBar = new UtilityBar();
	mainContentContainer.appendChild(utilityBar.element);
	mainContentContainer.appendChild(appCanvas.element);
	mainContentContainer.appendChild(appBar.element);
	page.appendChild(navigationDrawer.element);

	//add feed page
	feedPage = new FeedPage();
	appCanvas.pushContent(feedPage);

	splashImage = document.createElement('img');
	splashImage.setAttribute('class', 'splashOpen');
	splashImage.setAttribute('src', '/public/images/splash.png');
	setTimeout(function(){
		page.appendChild(this.splashImage);
		setTimeout(splashFadeOut, 1000);
	}, 100);

}

function addElementToDict(element, jsObject) {
	element.setAttribute('guid', elementCount);
	elements[elementCount] = jsObject;
	elementCount++;
}

function refreshFeed() {
  App.locator.getLoc(function(userLoc){
    var event = new CustomEvent('start-feed', { detail: userLoc });
    document.dispatchEvent(event);
  });
}

function initialize() {
	refreshFeed();
	elements = {};
	elementCount = 0;
	drawPageElements();
	setTouchListeners();

  var messageOut = document.getElementById('message-out');
  var titleOut = document.getElementById('title-out');
  var submit = document.getElementById('submit-post');

  submit.addEventListener(function (e) {
    console.log(e);
  });

  submit.setAttribute('disabled', true);

  messageOut.onkeyup = function(){

  	if(messageOut.value.length>0){
  		submit.removeAttribute('disabled');
  	}else{
  		submit.setAttribute('disabled', true);
  	}

  };

  submit.addEventListener('click', function() {

		App.locator.getLoc(function (loc) {

			console.log('data to page: ' + JSON.stringify(loc));

      var data = { timestamp : new Date() };
      data.title = titleOut.value.toString();
      data.body = messageOut.value.toString();
      data.loc = { type: 'Point', coordinates: [ loc.lon, loc.lat ] };
      App.postman.post(data, function (res) {
        console.log('post ok, contents - ' + JSON.stringify(res));

			  var postModal = document.getElementById('postModal');
	      postModal.setAttribute('class', '');
	      postModal.setAttribute('class', 'contentAreaModalUp');

	      refreshFeed();

      });

		});

  }, false);

}

function splashFadeOut() {
	splashImage.setAttribute('class', 'splashHide');
	setTimeout(splashKill, 700);
}

function splashKill() {
	page.removeChild(splashImage);
}

function clicked(element) {
	elements[element.getAttribute('guid')].clicked();
}

function onMouseDown(that, event) {
	var element = that.element;
	if (element != document) {
		if (elements[element.getAttribute('guid')] !== null) {
			elements[element.getAttribute('guid')].onMouseDown(element, event);
		}
	}
	else {

	}
}

function onMouseUp(that, event)
{
	var element = that.element;
	if (element == document) {
		scrollView.onMouseUp(event);
	}
	else {
		elements[element.getAttribute('guid')].onMouseUp(event);
	}

	for (var item in elements) {
		if (elements[item] instanceof Button && !elements[item].multiSelect) {
			elements[item].isMouseDown = false;
		}
	}
	for (var scrollV in scrollViewRegister) {
		scrollViewRegister[scrollV].onMouseUp(event);
	}

	scrollViewRegister = new Array();
	activeScrollViews = new Array();
	activeButton = null;
}

function onMouseMove(element, event) {
	if (element == document) {
		for (var scrollV in activeScrollViews) {
			activeScrollViews[scrollV].onMouseMove(event);
		}
	}
	else {
		elements[element.getAttribute('guid')].onMouseMove(event);
	}
}

function onMouseOut(element)
{
	elements[element.getAttribute('guid')].onMouseOut();
}

function transitionCompleted()
{
	elements[this.getAttribute('guid')].transitionCompleted();
}

function onMouseOver(element)
{
	elements[element.getAttribute('guid')].onMouseOver();
}

// document.addEventListener( 'touchstart' , function stopScrolling( touchEvent ) { touchEvent.preventDefault(); } , false );
// document.addEventListener( 'touchmove' , function stopScrolling( touchEvent ) { touchEvent.preventDefault(); } , false );

function setTouchListeners() {
	document.body.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
	document.getElementById('navigationDrawer').addEventListener('touchmove', function(e) { e.stopPropagation(); }, false);
	document.getElementById('appCanvas').addEventListener('touchmove', function(event){ event.stopPropagation(); }, false);
}

/******************************end app.js******************************/
