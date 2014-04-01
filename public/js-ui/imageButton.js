ImageButton.prototype = new Button();
ImageButton.prototype.constructor = ImageButton;

function ImageButton(src) {
	Button.call(this);
	this.imageElement = document.createElement("img");
	this.imageElement.setAttribute("class", "image");
	this.imageElement.setAttribute("src", src);
	this.element.appendChild(this.imageElement);
	this.imageElement.draggable = false;
}
