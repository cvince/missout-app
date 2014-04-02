'use strict';

// Button.prototype.onClicked;
// Button.prototype.x;

function Button() {
	this.element = document.createElement('div');
	this.element.setAttribute('class', 'button');

	var normalStyle = 'button';
	var mouseDownStyle = 'buttonClicked';
	var isMouseDown;
	var listeningForScrolling;
	var scrolling;
	var activeButton;

	var onMouseDown = function(element, e) {
		isMouseDown = true;
		listeningForScrolling = true;
		scrolling = false;
		element.setAttribute('class', mouseDownStyle);
		activeButton = element;
	};
	// addElementToDict(this.element, this);
	// this.element.onclick = function()
	// {
	// 	clicked(this);
	// }

	this.element.addEventListener( 'touchstart' , function touchStart( e ) { onMouseDown(this, e); } , false );
	this.element.addEventListener( 'touchmove', function touchMove ( e ) { }, false);
	this.element.addEventListener( 'touchend' , function touchEnd( e ) { onMouseUp(this, e);} , true );
	this.element.addEventListener('onmouseout', function mouseOut(e) { onMouseOut(this, e); }, true);
	this.element.addEventListener('onmouseover', function mouseOver(e) { onMouseOver(this, e); }, true);
}

Button.prototype.onMouseUp = function(element, e) {
	this.element.setAttribute('class', this.normalStyle);
	if (this.isMouseDown) {
		if (this.onClicked) {
			this.onClicked(this);
		}
	}
	this.isMouseDown = false;
}

Button.prototype.onMouseOut = function(element, e) {
	this.element.setAttribute('class', this.normalStyle);
}

Button.prototype.onMouseOver = function(element, e) {
	if (this.isMouseDown) {
		this.element.setAttribute('class', this.mouseDownStyle);
	}
}

Button.prototype.setLeft = function(left) {
	this.x = left;
	this.element.style.left = left + 'rem';
}
