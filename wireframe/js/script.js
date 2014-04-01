'use strict';

document.body.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
document.getElementById('drawers').addEventListener('touchmove', function(e) { e.stopPropagation(); }, false);

var appcanvas = document.getElementById('appcanvas');
appcanvas.addEventListener('touchmove', function(event){
  event.stopPropagation();
},  false  );
/*******
 Enable Snap.js Menu for left and right drawers.  ******/
var snapper = new Snap({
  element: document.getElementById('appcanvas'),
  addBodyClasses: true,
  hyperextensible: false
});

snapper.on('start', function(){
  //console.log('dragging');
});

document.getElementById('notifications').addEventListener('click', function(){
  if( snapper.state().state == 'left' ){
    snapper.close();
  } else {
    snapper.open('left');
  }
});


// SwipeJS Carousels
var elem1 = document.getElementById('swipe-1');
window.mySwipe = Swipe(elem1, {
  startSlide: 1,
  //auto: 3000,
  continuous: false,
  disableScroll: false,
  stopPropagation: true,
  callback: function(index, element) {},
  transitionEnd: function(index, element) {}
});

var elem1 = document.getElementById('swipe-1');
var bullets1 = document.getElementById('pagination-1').getElementsByTagName('bullet');

window.mySwipe = Swipe(elem1, {
    continuous: true,
    callback: function(pos) {
      var i = bullets1.length;
      while (i--) {
        bullets1[i].className = ' ';
      }
      bullets1[pos].className = 'on';

    }
});


// SwipeJS Carousels
var elem2 = document.getElementById('swipe-2');
window.mySwipe = Swipe(elem2, {
  startSlide: 1,
  //auto: 3000,
  continuous: false,
  disableScroll: false,
  stopPropagation: true,
  callback: function(index, element) {},
  transitionEnd: function(index, element) {}
});

var elem2 = document.getElementById('swipe-2');
var bullets2 = document.getElementById('pagination-2').getElementsByTagName('bullet');

window.mySwipe = Swipe(elem2, {
    continuous: true,
    callback: function(pos) {
      var i = bullets2.length;
      while (i--) {
        bullets2[i].className = ' ';
      }
      bullets2[pos].className = 'on';

    }
});


// SwipeJS Carousels
var elem3 = document.getElementById('swipe-3');
window.mySwipe = Swipe(elem3, {
  startSlide: 1,
  //auto: 3000,
  continuous: false,
  disableScroll: false,
  stopPropagation: true,
  callback: function(index, element) {},
  transitionEnd: function(index, element) {}
});

var elem3 = document.getElementById('swipe-3');
var bullets3 = document.getElementById('pagination-3').getElementsByTagName('bullet');

window.mySwipe = Swipe(elem3, {
    continuous: true,
    callback: function(pos) {
      var i = bullets3.length;
      while (i--) {
        bullets3[i].className = ' ';
      }
      bullets3[pos].className = 'on';

    }
});
