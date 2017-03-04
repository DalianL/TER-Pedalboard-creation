window.onload = init;

function init() {
  pedalboard.elem = document.querySelector("#pedalboard");
  var p1 = new Pedal("pedal1", 20, 30, 30, 50);
  var p2 = new Pedal("pedal2", 100, 150, 50, 50);
  var p3 = new Pedal("pedal3", 10, 200, 50, 50);

  pedalboard.add(p1);
  pedalboard.add(p2);
  pedalboard.add(p3);
  
  addDraggableListeners();
}

function addDraggableListeners() {
    // Add a mousedown listener to all draggable elements
    var listOfDraggable = document.querySelectorAll(".draggable");
    listOfDraggable.forEach(function(e) {
       e.addEventListener('mousedown', mouseDownDraggable, false);
    });
  
    window.addEventListener('mouseup', mouseUpDraggable, false);  

    // celui-là pour detecter si on est au voisinage des
    // inputs et outputs des pédales
    pedalboard.elem.addEventListener('mousemove', highlightInputsOutputs);
}
