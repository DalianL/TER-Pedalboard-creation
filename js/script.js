window.onload = init;

function init() {  
  pedalboard.init();

  let cvs = document.querySelector("#svg-canvas");
  let cvsWidth = cvs.width.baseVal.value;
  let cvsHeight = cvs.height.baseVal.value;

  let pIn = new Pedal("pedalIn", -1, -60, -20 + (cvsHeight / 2), 10, 10);
  let pOut = new Pedal("pedalOut", -1, cvsWidth, -20 + (cvsHeight / 2), 10, 10);

  pedalboard.addPedal(pIn);
  pedalboard.addPedal(pOut);

  // Handles the WebAudio graph initialization
  soundHandler();

  // For new pedals to be added
  addNewPedalListeners();

  // For pedals to be draggable
  addDraggableListeners();

  // For the jack menu to appear
  addMenuListerners();

  // For mouse zooming 
  addZoomListener();

}

function addNewPedalListeners() {
  var newPedals = document.querySelectorAll(".pedal");
  for (var i = 0; i < newPedals.length; i++) {
    newPedals[i].addEventListener('dragstart', pedalDragStart, false);
  }
}

function addDraggableListeners() {
    window.addEventListener('mousedown', mouseDownDraggable, false);  

    window.addEventListener('mouseup', mouseUpDraggable, false);  

    // celui-là pour detecter si on est au voisinage des
    // inputs et outputs des pédales
    pedalboard.elem.addEventListener('mousemove', highlightInputsOutputs);
}

function addMenuListerners() {
  menu = document.querySelector("#context-menuJack"); 
  divs = document.querySelectorAll(".input");
  menuState = 0;

  divs.forEach(function(d) {
    handleJackMenu(d);
    resizeListener(d);
  })
}

function addZoomListener() {
  elem = document.querySelector('#pedalboard');
  // IE9, Chrome, Safari, Opera
  elem.addEventListener("mousewheel", mouseWheelHandler, false);
  // Firefox
  elem.addEventListener("DOMMouseScroll", mouseWheelHandler, false);
}
