'use strict';
/*jslint unused: false*/

Button.prototype.normalStyle = 'button';
Button.prototype.mouseDownStyle = 'buttonClicked';
// Button.prototype.onClicked;
// Button.prototype.x;

function Button() {
	var that = this;
	this.element = document.createElement('div');
	this.element.setAttribute('class', 'button');
	this.listeningForScrolling = false;
	this.scrolling = false;
	this.isMouseDown = false;
	this.activeButton = null;
	// addElementToDict(this.element, this);
	// this.element.onclick = function()
	// {
	// 	clicked(this);
	// }
	this.element.addEventListener('touchstart' , function touchStart( e ) { that.onMouseDown(e); } , false );
	this.element.addEventListener('touchmove', function touchMove ( e ) { }, false);
	this.element.addEventListener('touchend' , function touchEnd( e ) { that.onMouseUp(e);} , true );
	this.element.addEventListener('onmouseout', function mouseOut(e) { that.onMouseOut(e); }, true);
	this.element.addEventListener('onmouseover', function mouseOver(e) { that.onMouseOver(e); }, true);
}

Button.prototype.onMouseDown = function(e) {
	this.isMouseDown = true;
	this.listeningForScrolling = true;
	this.scrolling = false;
	this.element.setAttribute('class', this.mouseDownStyle);
	this.activeButton = this;
};

Button.prototype.onMouseUp = function(e) {
	this.element.setAttribute('class', this.normalStyle);
	if (this.isMouseDown) {
		if (this.onClicked) {
			this.onClicked(this);
		}
	}
	this.isMouseDown = false;
};

Button.prototype.onMouseOut = function(e) {
	this.element.setAttribute('class', this.normalStyle);
};

Button.prototype.onMouseOver = function(e) {
	if (this.isMouseDown) {
		this.element.setAttribute('class', this.mouseDownStyle);
	}
};

Button.prototype.setLeft = function(left) {
	this.x = left;
	this.element.style.left = left + 'rem';
};