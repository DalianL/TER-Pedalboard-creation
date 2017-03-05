window.onload = init;
var p1, p2, p3;

function init() {  
   pedalboard.elem = document.querySelector("#pedalboard");
   p1 = new Pedal("pedal1", 20, 30, 30, 50);
   p2 = new Pedal("pedal2", 130, 150, 50, 50);
   p3 = new Pedal("pedal3", 300, 200, 50, 50);

   pedalboard.add(p1);
   pedalboard.add(p2);
   pedalboard.add(p3);
  
   createJack("cable1", p1, p2, "black");
   createJack("cable2", p2, p3, "black");
  
   // if we resize the pedalboard we must resize the
   // svg canvas inside it.
   pedalboard.elem.addEventListener('resize', resizePedalBoard);

   // For pedals to be draggable
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