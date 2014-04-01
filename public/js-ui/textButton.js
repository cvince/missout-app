TextButton.prototype = new Button();
TextButton.prototype.constructor = TextButton;
TextButton.prototype.textSpan;

function TextButton(text) {
	Button.call(this);
	this.textSpan = document.createElement("span");
	this.textSpan.setAttribute("class", "title");
	this.textSpan.innerHTML = text;
	this.textSpan.style.cursor = "default";
	this.element.appendChild(this.textSpan);
}
