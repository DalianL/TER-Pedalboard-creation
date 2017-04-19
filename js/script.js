window.onload = init;

function init() {  
  pedalboard.init();
  let p1 = new Pedal("pedal1", 70, 130, 135, 220, "pedal-delay");
  let p2 = new Pedal("pedal2", 370, 250, 225, 245, "pedal-flanger");
  let p3 = new Pedal("pedal3", 770, 200, 110, 245, "pedal-lowpass");
  let p4 = new Pedal("pedal4", 1070, 100, 135, 275, "pedal-quadrafuzz");

  pedalboard.addPedal(p1);
  pedalboard.addPedal(p2);
  pedalboard.addPedal(p3);
  pedalboard.addPedal(p4);

  pedalboard.connect(p1, p2);
  pedalboard.connect(p2, p3);
  pedalboard.connect(p1, p3);
  pedalboard.connect(p1, p4);
  pedalboard.connect(p3, p4);

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
