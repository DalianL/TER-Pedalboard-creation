var menu; 
var menuState;
var divs;
var pedalMenu;

function handleJackMenu(elem) {
  elem.addEventListener( "click", function(e) {
    e.preventDefault();
    if (pedalMenu.inputJacks.length > 1) {
      createMenuItems(pedalMenu.inputJacks);
      toggleMenuOn();
      positionMenu(e,pedalMenu);
    }
  });
}

function createMenuItems(jacks) {
  document.getElementById("menu-container").innerHTML = "";
  let newMenuWid = 70 * (1 + zoom);
  menu.style.width = "" + newMenuWid + "px";
  document.querySelector('.context-menu__items').style.width = "" + newMenuWid + "px";

  let len = jacks.length;
  // Approximatively adapts the Y position where the jacks in menu start
  // according to the number of jacks plugged in the pedal, since the
  // menu adapts its position according to the number of item
  let offsetY = -(5*len) + 7 - (2 * len);
  if (zoom == 1) {
    if (board.style.transformOrigin == 'left top 0px' || board.style.transformOrigin == 'center top 0px' || board.style.transformOrigin == 'right top 0px') {
      offsetY -= 2.5;
    }
    if (board.style.transformOrigin == 'left bottom 0px' || board.style.transformOrigin == 'center bottom 0px' || board.style.transformOrigin == 'right bottom 0px') {
      offsetY += 2.5;
    }
  }
  
  jacks.forEach(function(j) {
    // Adds a menu item for each jack in the pedal
    let ul = document.getElementById("menu-container");
    let li = document.createElement("li");
    li.appendChild(document.createTextNode("")); //"Jack " + j.p1.id.substring(5,6)));
    li.setAttribute("id", "jack"+j.p1.id.substring(5,6)); 
    zoom == 0 ? li.classList.add("context-menu__item1") : li.classList.add("context-menu__item2");
    /* let menuItemWid = 40 * (1 + (zoom * 2));
    let menuItemHei = 14 * (zoom + 1);
    li.style = "width:"+ menuItemWid +"px; height: "+ menuItemHei +"px"; */
    ul.appendChild(li);

    // Repositions the current jack so that it feels like it's unplugged 
    // while in the opened menu
    repositionJack(j, offsetY);
    offsetY += 14;

    li.addEventListener( "mousedown", function(e) {
      // Computes the location of the mouse in the SVG canvas
      var loc = cursorPoint(e);

      e.preventDefault();
      e.stopPropagation();
      // first we disconnect the jack before immediatly creating
      // a new one to drag
      pedalboard.disconnect(j.p1, j.p2);
      pedalboard.currentState = "drawingNewJack";
      let x1 = j.p1.getOutputPos().x;
      let y1 = j.p1.getOutputPos().y;
      let x2 = j.p2.getInputPos().x;
      let y2 = j.p2.getInputPos().y;

      pedalboard.currentDraggableJack = createBezierSVGJack("tmpJack", x1, y1, loc.x, loc.y);
      pedalboard.currentDraggableJack.end.setAttribute("x", loc.x - 7);
      pedalboard.currentDraggableJack.end.setAttribute("y", loc.y - 10);
      pedalboard.currentDraggableJack.sourcePedal = j.p1;
      pedalboard.currentDraggableJack.x1 = x1;
      pedalboard.currentDraggableJack.y1 = y1;
      toggleMenuOff();
      // we update the position of the jack because the default toggle
      // moved the jack back to the menu
      window.addEventListener('mousemove', mouseMoveDraggable, true);
    })
  })

}

function toggleMenuOn() {
  if ( menuState !== 1 ) {
    menuState = 1;
    menu.classList.add("context-menu--active");
  }
}

function toggleMenuOff() {
  if ( menuState !== 0 ) {
    resetJackPosition(pedalMenu.inputJacks);
    pedalMenu = null;
    menuState = 0;
    menu.classList.remove("context-menu--active");
  }
}

function resetJackPosition(jacks) {
  jacks.forEach(function(j) {
    let posPedal1 = j.p1.getOutputPos();
    let posPedal2 = j.p2.getInputPos();
    updateSVGJack(j.jackSVG, posPedal1.x, posPedal1.y, posPedal2.x, posPedal2.y);
  });
}

// Get mouse pointer position
function getPosition(e) {
  // Computes the location of the mouse in the SVG canvas
  var loc = cursorPoint(e);
  
  var rect = e.target.getBoundingClientRect();
  var posx = loc.x;// - rect.left;
  var posy = loc.y;// - rect.top;
  return {
    x: posx,
    y: posy
  };
}

function positionMenu(e,p) {

  var inputCoordsX;
  var inputCoordsY;

  var menuWidth = menu.offsetWidth + 1;
  var menuHeight = menu.offsetHeight + 1;
  
  if (zoom == 1) {
    var board = document.querySelector('#pedalboard');
          
    // Required to adjust the position according to where the origin was set,
    // as the origin determines the menu css attributes top and left positions
    if (board.style.transformOrigin == 'left top 0px') {
      inputCoordsX = p.getInputPos().x * 2;
      inputCoordsY = p.getInputPos().y * 2;
    } else if (board.style.transformOrigin == 'left center 0px') {
      inputCoordsX = p.getInputPos().x * 2;
      inputCoordsY = (p.getInputPos().y * 2) - (parseInt(window.getComputedStyle(board).height, 10) / 2);
    } else if (board.style.transformOrigin == 'left bottom 0px') {
      inputCoordsX = p.getInputPos().x * 2;
      inputCoordsY = (p.getInputPos().y * 2) - parseInt(window.getComputedStyle(board).height, 10);
    } else if (board.style.transformOrigin == 'center top 0px') {
      inputCoordsX = p.getInputPos().x * 2 - (parseInt(window.getComputedStyle(board).width, 10) / 2);
      inputCoordsY = p.getInputPos().y * 2;
    } else if (board.style.transformOrigin == 'center center 0px') {
      inputCoordsX = p.getInputPos().x * 2 - (parseInt(window.getComputedStyle(board).width, 10) / 2);
      inputCoordsY = p.getInputPos().y * 2 - (parseInt(window.getComputedStyle(board).height, 10) / 2);
    } else if (board.style.transformOrigin == 'center bottom 0px') {
      inputCoordsX = p.getInputPos().x * 2 - (parseInt(window.getComputedStyle(board).width, 10) / 2);
      inputCoordsY = p.getInputPos().y * 2 - parseInt(window.getComputedStyle(board).height, 10);
    } else if (board.style.transformOrigin == 'right top 0px') {
      inputCoordsX = p.getInputPos().x * 2 - parseInt(window.getComputedStyle(board).width, 10);
      inputCoordsY = p.getInputPos().y * 2;
    } else if (board.style.transformOrigin == 'right center 0px') {
      inputCoordsX = p.getInputPos().x * 2 - parseInt(window.getComputedStyle(board).width, 10);
      inputCoordsY = p.getInputPos().y * 2 - (parseInt(window.getComputedStyle(board).height, 10) / 2);
    } else if (board.style.transformOrigin == 'right bottom 0px') {
      inputCoordsX = p.getInputPos().x * 2 - parseInt(window.getComputedStyle(board).width, 10);
      inputCoordsY = p.getInputPos().y * 2 - parseInt(window.getComputedStyle(board).height, 10);
    }

    inputCoordsX += pedalboard.pedalboardOrigin.x * 2;
    inputCoordsY += pedalboard.pedalboardOrigin.y * 2;
  
  } else {

    inputCoordsX = p.getInputPos().x;
    inputCoordsY = p.getInputPos().y;

  }

  var windowWidth = e.target.innerWidth;
  var windowHeight = e.target.innerHeight;

  if ((windowWidth - inputCoordsX) < menuWidth) {
    menu.style.left = windowWidth - menuWidth + "px";
  } else {
    menu.style.left = inputCoordsX - menuWidth + 13 + "px";
  }

  if ((windowHeight - inputCoordsY) < menuHeight) {
    menu.style.top = windowHeight - menuHeight + "px";
  } else {
    menu.style.top = inputCoordsY - menuHeight/2 + 13 + "px";
  }
}