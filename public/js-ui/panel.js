Panel.prototype.children;
Panel.prototype.x = 0;
Panel.prototype.y = 0;

function Panel()
{
	this.element = document.createElement("div");
	this.children = new Array();
}

Panel.prototype.layoutChildren = function()
{
	
}

Panel.prototype.setLeft = function(left)
{
	this.x = left;
	this.element.style.left = left + "px";
}

Panel.prototype.addChild = function(child)
{
	this.children[this.children.length] = child;
	this.element.appendChild(child.element);
}

Panel.prototype.addElement = function(element)
{
	this.children[this.children.length] = element;
	this.element.appendChild(element);
}

Panel.prototype.setTop = function(top)
{
	this.y = top;
	this.element.style.top = top + "px";
	console.log(this.element.style.top);

}