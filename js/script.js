window.onload = init;

function init() {  
  pedalboard.init();

  let pdb = document.querySelector("#pedalboard");
  let pdbW = parseInt(window.getComputedStyle(pdb).width, 10);
  let pdbH = parseInt(window.getComputedStyle(pdb).height, 10);

  let pIn = new Pedal("pedalIn", -1, -55, -20 + (pdbH / 2), 10, 10);
  let pOut = new Pedal("pedalOut", -1, pdbW, -20 + (pdbH / 2), 10, 10);

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

function resizeListener (elem) {
  window.onresize = function(e) {
    // Hide menu if the window is resized
    toggleMenuOff();

    // Repositions the pedal located on the right 
    // according to the new width
    let pdb = document.querySelector("#pedalboard");
    let pdbW = parseInt(window.getComputedStyle(pdb).width, 10);
    let pdbH = parseInt(window.getComputedStyle(pdb).height, 10);
    pedalboard.pedals[1].move(pdbW, -20 + (pdbH / 2));
  
  }
}