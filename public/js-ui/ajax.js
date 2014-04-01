var ajax = new Ajax();

function Ajax(){}

Ajax.prototype.httpRequest;
Ajax.prototype.container;

Ajax.prototype.callbacks = new Array();
Ajax.prototype.httpRequests = new Array();

Ajax.prototype.makeRequest = function(url, callback) {
	var httpRequest;

	if (window.XMLHttpRequest) {
		httpRequest = new XMLHttpRequest();
	} else if (!httpRequest) {
	  alert('Giving up :( Cannot create an XMLHTTP instance');
	  return false;
	}
	httpRequest.onreadystatechange = this.displayContents;
	httpRequest.open('GET', url);
	httpRequest.send();
	//maintain count of httpRequests
	this.httpRequests[this.httpRequests.length] = httpRequest;
	//maintain count of httpRequests
	this.callbacks[this.callbacks.length] = callback;
}

Ajax.prototype.displayContents = function() {
	for (var i=0; i < ajax.httpRequests.length; i++) {
		var httpRequest = ajax.httpRequests[i];
		if (httpRequest.readyState == 4) {
  			ajax.callbacks[i].displayContentItems(httpRequest.responseText);
			ajax.callbacks.splice(i, 1);
			ajax.httpRequests.splice(i, 1);
		}
	}
}
