getID.prototype.function(id){
  return document.getElementById(id);
}

getClass.prototype.function(cl){
  return document.getElementsByClassName(cl);
}

'use strict';
function AppBar() {
  this.element = document.createElement('div');
  this.element.setAttribute('class', 'appBar');
  this.displayContentItems();
}

AppBar.prototype.displayContentItems = function() {
  this.backgroundImage = document.createElement('img');
  this.backgroundImage.setAttribute('class', 'appBarBackground');
  this.backgroundImage.setAttribute('img', '/public/images/close_button.png');
  this.element.appendChild(this.backgroundImage);
  this.buttonContainer = document.createElement('div');
  this.buttonContainer.setAttribute('class', 'appBarButtonContainer');
  this.element.appendChild(this.buttonContainer);
};

AppBar.prototype.setButtons = function(buttons) {
  while (this.buttonContainer.hasChildNodes()) {
    this.buttonContainer.removeChild(this.buttonContainer.lastChild);
  }
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    this.buttonContainer.appendChild(button.element);
  }

  var postButton = document.getElementById('postButton');
  var postModal = document.getElementById('contentModal');

  var togg = 0;

  postButton.addEventListener('click', function(){
    if(togg === 0){
      postModal.setAttribute('class', '');
      postModal.setAttribute('class', 'contentAreaModalDown');
      togg = 1;
    }else if(togg === 1){
      postModal.setAttribute('class', '');
      postModal.setAttribute('class', 'contentAreaModalUp');
      togg = 0;
    }
  });

};
