'use strict';

// AppCanvas.prototype.contentA;
// AppCanvas.prototype.contentB;
// AppCanvas.prototype.currentContentArea;
// AppCanvas.prototype.topContent;
// AppCanvas.prototype.stack;
AppCanvas.prototype.stackCount = 0;
AppCanvas.prototype.readyForChange = true;

function AppCanvas() {
	var drawerOpen;
	this.element = document.createElement('div');
	this.element.setAttribute('id', 'appCanvas');
	this.element.setAttribute('class', 'appCanvas scrollable');
	this.contentA = document.createElement('div');
	this.contentA.setAttribute('id', 'feed');
	this.contentB = document.createElement('div');
	this.modalContentA = document.createElement('div');

	this.contentA.setAttribute('class', 'contentAreaCurrent scrollable');
	this.contentB.setAttribute('class', 'contentArea');
	this.modalContentA.setAttribute('class', 'contentAreaModalDown');

	this.element.appendChild(this.contentA);
	this.element.appendChild(this.contentB);
	this.element.appendChild(this.modalContentA);

	this.stack = new Array(20);

	if (drawerOpen === true) {
		this.scrolling = false;
	} else if (drawerOpen === false) {
		this.scrolling = true;
	}
}

AppCanvas.prototype.presentModal = function(content) {
	if (this.readyForChange) {
		this.readyForChange = false;
		this.modalContentA.appendChild(content.element);
		this.modalContentA.setAttribute('class', 'contentAreaModalUp');
		setTimeout(appCanvas.modalChange, 650);
		this.modal = content;
		this.hasModal = true;
	}
};

AppCanvas.prototype.dismissModal = function() {
	if (this.readyForChange) {
		this.readyForChange = false;
		this.modalContentA.setAttribute('class', 'contentAreaModalDown');
		setTimeout(appCanvas.modalChange, 650);
		this.hasModal = false;
	}
};

AppCanvas.prototype.modalChange = function() {
	if (appCanvas.hasModal) {
		appCanvas.modal.updateAppBar();
	}
	else {
		if (appCanvas.modalContentA.children.length > 0) {
			appCanvas.modalContentA.removeChild(appCanvas.modalContentA.lastChild);
		}
		appCanvas.topContent.updateAppBar();
	}
	appCanvas.readyForChange = true;
};

AppCanvas.prototype.pushContent = function(content) {
	if (this.readyForChange) {
		this.readyForChange = false;
		this.stack[this.stackCount] = content;
		this.stackCount++;

		if (this.currentContentArea == this.contentA) {
			this.contentB.setAttribute('class', 'contentAreaQueueForward');
		}
		else {
			this.contentA.setAttribute('class', 'contentAreaQueueForward');
		}

		setTimeout(appCanvas.internalPushContent, 100);
	}
};

AppCanvas.prototype.internalPushContent = function() {
	var content = appCanvas.stack[appCanvas.stackCount - 1];
	appCanvas.topContent = content;
	if (appCanvas.currentContentArea == appCanvas.contentA) {
		// alert('pushingToB');
		appCanvas.contentB.appendChild(content.element);
		appCanvas.contentB.setAttribute('class', 'contentAreaCurrent');
		appCanvas.contentA.setAttribute('class', 'contentAreaForwardOut');
		appCanvas.currentContentArea = appCanvas.contentB;
	}
	else {
		// alert('pushingToA');
		appCanvas.contentA.appendChild(content.element);
		appCanvas.contentA.setAttribute('class', 'contentAreaCurrent');
		appCanvas.contentB.setAttribute('class', 'contentAreaForwardOut');
		appCanvas.currentContentArea = appCanvas.contentA;
	}

	setTimeout(contentChanged, 660);
};

AppCanvas.prototype.popContent = function() {
	if (this.readyForChange &&  appCanvas.stackCount > 1) {
		this.readyForChange = false;
		if (this.currentContentArea == this.contentA) {
			this.contentB.setAttribute('class', 'contentAreaQueueBackward');
		}
		else {
			this.contentA.setAttribute('class', 'contentAreaQueueBackward');
		}

		setTimeout(appCanvas.internalPopContent, 100);
	}
};

AppCanvas.prototype.popToHome = function() {
	if (this.readyForChange &&  appCanvas.stackCount > 1) {
		this.poppingToHome = true;
		this.readyForChange = false;
		if (this.currentContentArea == this.contentA) {
			this.contentB.setAttribute('class', 'contentAreaQueueBackward');
		}
		else {
			this.contentA.setAttribute('class', 'contentAreaQueueBackward');
		}

		setTimeout(appCanvas.internalPopContent, 100);
	}
};


AppCanvas.prototype.internalPopContent = function() {
	if (appCanvas.stackCount > 1) {
		var contentToShow;
		if (appCanvas.poppingToHome) {
			contentToShow = appCanvas.stack[0];
			appCanvas.stackCount = 1;
			appCanvas.poppingToHome = false;
		}
		else {
			contentToShow = appCanvas.stack[appCanvas.stackCount - 2];
			appCanvas.stackCount--;
		}

		appCanvas.topContent = contentToShow;

		if (appCanvas.currentContentArea == appCanvas.contentA) {
			appCanvas.contentB.appendChild(contentToShow.element);
			appCanvas.contentB.setAttribute('class', 'contentAreaCurrent');
			appCanvas.contentA.setAttribute('class', 'contentAreaBackOut');
			appCanvas.currentContentArea = appCanvas.contentB;
		}
		else {
			appCanvas.contentA.appendChild(contentToShow.element);
			appCanvas.contentA.setAttribute('class', 'contentAreaCurrent');
			appCanvas.contentB.setAttribute('class', 'contentAreaBackOut');
			appCanvas.currentContentArea = appCanvas.contentA;
		}

		setTimeout(contentChanged, 660);
	}
};

function contentChanged() {
	appCanvas.readyForChange = true;
	appCanvas.topContent.updateAppBar();
	appCanvas.topContent.updateUtilityBar();
	if (appCanvas.stack.length > 1) {
		if (appCanvas.currentContentArea == appCanvas.contentA) {
			appCanvas.contentB.setAttribute('class', 'contentAreaOffScreen');
			if (appCanvas.contentB.children.length > 0) {
				appCanvas.contentB.removeChild(appCanvas.contentB.lastChild);
			}
			// alert('removeBContent');

		}
		else {
			appCanvas.contentA.setAttribute('class', 'contentAreaOffScreen');
			if (appCanvas.contentA.children.length > 0) {
				appCanvas.contentA.removeChild(appCanvas.contentA.lastChild);
			}
			// alert('removeAContent');

		}
	}
	//  place superstar shit to happen when the appCanvas appears
}
