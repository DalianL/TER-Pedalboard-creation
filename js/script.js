window.onload = init;

function init() {  
  pedalboard.init(); 
  let p1 = new Pedal("pedal1", 120, 130, 50, 50);
  let p2 = new Pedal("pedal2", 280, 180, 50, 50);
  let p3 = new Pedal("pedal3", 170, 270, 50, 50);
  let p4 = new Pedal("pedal4", 350, 400, 50, 50);
  let p5 = new Pedal("pedal5", 350, 300, 50, 50);

  pedalboard.addPedal(p1);
  pedalboard.addPedal(p2);
  pedalboard.addPedal(p3);
  pedalboard.addPedal(p4);
  pedalboard.addPedal(p5);

  pedalboard.connect(p1, p2);
  pedalboard.connect(p2, p3);
  pedalboard.connect(p3, p4);
  pedalboard.connect(p1, p3);
  pedalboard.connect(p3, p5);

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
  // IE9, Chrome, Safari, Opera
  window.addEventListener("mousewheel", mouseWheelHandler, false);
  // Firefox
  window.addEventListener("DOMMouseScroll", mouseWheelHandler, false);

/*  var svg = document.querySelector('#svg-canvas');
  var pt = svg.createSVGPoint();

  function cursorPoint(evt){
    pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  window.addEventListener('mousedown', function(evt){
    var loc = cursorPoint(evt);
    console.log("X : " + loc.x + " Y : " + loc.y)
  },false);*/

}