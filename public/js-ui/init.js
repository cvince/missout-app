'use strict';
/*global App*/
/*global UI*/
/*jslint unused: false*/
/*global json2html*/

window.UI = {};

function UIInitialize(){
	App.locator.getLoc(function(userLoc){
			var event = new CustomEvent('start-feed', { detail: userLoc });
			document.dispatchEvent(event);
		});

	UI.Skeleton();
	var buildSkeleton = new CustomEvent('buildSkeleton', {});
	document.dispatchEvent(buildSkeleton);

	UI.Control();
	document.body.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
}
