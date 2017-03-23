var menu; 
var menuState;
var divs;

function addMenuListerners() {
  menu = document.querySelector("#context-menuKnob"); 
  divs = document.querySelectorAll(".input");
  menuState = 0;

  divs.forEach(function(d) {
    ajouteMenu(d);
    resizeListener(d);
  })
}

function ajouteMenu(elem) {
  elem.addEventListener( "contextmenu", function(e) {
      e.preventDefault();
      toggleMenuOn();
      positionMenu(e);
  });
}

function toggleMenuOn() {
  if ( menuState !== 1 ) {
    menuState = 1;
    menu.classList.add("context-menu--active");
  }
}

function toggleMenuOff() {
  if ( menuState !== 0 ) {
    menuState = 0;
    menu.classList.remove("context-menu--active");
  }
}

// Get mouse pointer position
function getPosition(e) {
  var rect = e.target.getBoundingClientRect();
  var posx = e.clientX;// - rect.left;
  var posy = e.clientY;// - rect.top;
  return {
    x: posx,
    y: posy
  };
}

function positionMenu(e) {
  var clickCoords = getPosition(e);
  var clickCoordsX = clickCoords.x;// + e.target.offsetLeft;
  var clickCoordsY = clickCoords.y;// + e.target.offsetTop;

  var menuWidth = menu.offsetWidth + 1;
  var menuHeight = menu.offsetHeight + 1;

  var windowWidth = e.target.innerWidth;
  var windowHeight = e.target.innerHeight;

  if ((windowWidth - clickCoordsX) < menuWidth) {
    menu.style.left = windowWidth - menuWidth + "px";
  } else {
    menu.style.left = clickCoordsX + "px";
  }

  if ((windowHeight - clickCoordsY) < menuHeight) {
    menu.style.top = windowHeight - menuHeight + "px";
  } else {
   menu.style.top = clickCoordsY + "px";
  }
}

function resizeListener (elem) {
  window.onresize = function(e) {
    // Hide menu if the window is resized
    toggleMenuOff();
  }
}