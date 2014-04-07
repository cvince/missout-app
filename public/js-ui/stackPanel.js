StackPanel.prototype = new Panel();
StackPanel.prototype.constructor = StackPanel;

StackPanel.prototype.leftMargin = 0;
StackPanel.prototype.topMargin = 0;

StackPanel.prototype.y = 0;
StackPanel.prototype.x = 0;
StackPanel.prototype.orientation = "vertical";

function StackPanel() {
	Panel.call(this);
	this.element.setAttribute("class", "stackPanel");
}

StackPanel.prototype.layoutChildren = function() {
	if (this.orientation == "vertical") {
		var y = this.topMargin;
		for (var i = 0; i < this.children.length; i++) {
			var item = this.children[i];
			if (item instanceof HTMLElement) {
				item.style.top = y + "px";
			}
			else {
				item.element.style.top = y + "px";
			}
			item.top = y;
			y += item.height;
		}
		this.element.style.height = y + "px";
		this.size = {"width":0, "height":y + 50};
	}
	else {
		var x = this.leftMargin;
		for (var i = 0; i < this.children.length; i++) {
			var item = this.children[i];
			if (item instanceof HTMLElement) {
				item.style.left = x + "px";
			}
			else {
				item.element.style.left = x + "px";
			}
			item.left = x;
			x += item.width;
		}
		this.element.style.width = x + "px";
		this.size = {"width":x, "height":0};
	}
}

StackPanel.prototype.setTop = function(top) {
	this.y = top;
	this.element.style.top = top + "px";
	// log.innerHTML = this.element.style.top;
}
