window.onload = init;

function init() {  
   pedalboard.init(); 
   var p1 = new Pedal("pedal1", 20, 30, 30, 50);
   var p2 = new Pedal("pedal2", 100, 150, 50, 50);
   var p3 = new Pedal("pedal3", 10, 200, 50, 50);
   var p4 = new Pedal("pedal4", 250, 300, 50, 50);
   var p5 = new Pedal("pedal5", 150, 250, 50, 50);

   pedalboard.addPedal(p1);
   pedalboard.addPedal(p2);
   pedalboard.addPedal(p3);
   pedalboard.addPedal(p4);
  pedalboard.addPedal(p5);
  
   //var j1 = new Jack("cable1", p1, p2, "black");
   //var j2 = new Jack("cable2", p2, p3, "black");
   pedalboard.connect(p1, p2);
   pedalboard.connect(p2, p3);
   pedalboard.connect(p3, p4);
   pedalboard.connect(p1, p3);
     pedalboard.connect(p3, p5);

   
  
   // if we resize the pedalboard we must resize the
   // svg canvas inside it.
   window.addEventListener('resize', resizePedalBoard);

   // For pedals to be draggable
   addDraggableListeners();
}

function addDraggableListeners() {
    // Add a mousedown listener to all draggable elements
    let listOfDraggable = document.querySelectorAll(".draggable");
    listOfDraggable.forEach(function(e) {
       e.addEventListener('mousedown', mouseDownDraggable, false);
    });
  
    window.addEventListener('mouseup', mouseUpDraggable, false);  

    // celui-là pour detecter si on est au voisinage des
    // inputs et outputs des pédales
    pedalboard.elem.addEventListener('mousemove', highlightInputsOutputs);
}