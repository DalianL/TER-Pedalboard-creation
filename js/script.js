window.onload = init;

function init() {  
   pedalboard.init(); 
   let p1 = new Pedal("pedal1", 20, 30, 30, 50);
   let p2 = new Pedal("pedal2", 180, 80, 50, 50);
   let p3 = new Pedal("pedal3", 70, 170, 50, 50);
   let p4 = new Pedal("pedal4", 250, 300, 50, 50);
   let p5 = new Pedal("pedal5", 250, 200, 50, 50);

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

   // For new pedals to be added
   addNewPedalListeners();
  
   // For pedals to be draggable
   addDraggableListeners();
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