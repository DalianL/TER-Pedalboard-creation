let oldMousePosX, oldMousePosY

function mouseUpDraggable() {
    let p;
    window.removeEventListener('mousemove', mouseMoveDraggable, true);
    switch(pedalboard.currentState) {
      case "drawingNewJack":
        // Remove current tmp jack
        for(var i=1; i <= 4; i++) {
          var elem = document.querySelector("#tmpJack_"+i);
          elem.parentNode.removeChild(elem);
        }
        if((p = pedalboard.findPedalWhoseInputIsHighlighted()) !== undefined) {
          // we are dragging a new Jack and we have the mouse pointer
          // close to a pedal input: let's connect the Jack !
          let alreadyAdded = false;
          for (var i = 0; i < p.inputJacks.length; i++) {
            // checks if the jack is already plugged in by checking if the source 
            // pedal already is in the inputJack list of the destination pedal
            if (p.inputJacks[i].p1 == pedalboard.currentDraggableJack.sourcePedal) {
              alreadyAdded = true;
            }
          }
          if (!alreadyAdded) pedalboard.connect(pedalboard.currentDraggableJack.sourcePedal, p);
        }
        delete pedalboard.currentDraggableJack;
      break;
    case "removingJack":
      if((p = pedalboard.findPedalWhoseInputIsHighlighted()) !== undefined) {
        pedalboard.disconnect(p.inputJacks[0].p1, p);
      }
      break;
    case "draggingPedal":
      break;
    }
    // set back pedalboard state to "none", we finished a drag
    pedalboard.currentState = "none";
}

function mouseDownDraggable(e){
  toggleMenuOff();
  // Quand on clique on mémorise : 1) l'ancienne position
  // de l'objet qu'on draggue et 2) l'ancienne position de
  // la souris (la position cliquee) et 3) on ajoute un 
  // mousemove listener
  let p;
  window.addEventListener('mousemove', mouseMoveDraggable, true);
  if((p = pedalboard.findPedalWhoseOutputIsHighlighted()) !== undefined) {
    // an output of a pedal is selected, if we drag the mouse
    // we're in the process of dragging a new cable/jack
    pedalboard.currentState = "drawingNewJack";
    let x1 = p.getOutputPos().x;
    let y1 = p.getOutputPos().y;

    pedalboard.currentDraggableJack = createBezierSVGJack("tmpJack", x1, y1, e.clientX, e.clientY);
    pedalboard.currentDraggableJack.sourcePedal = p;
    pedalboard.currentDraggableJack.x1 = x1;
    pedalboard.currentDraggableJack.y1 = y1;

  } else if ((p = pedalboard.findPedalWhoseInputIsHighlighted()) !== undefined) {
    // if the mouse left click button is pressed
      // and if the array of input jacks contains at least one element
      //if (typeof p.inputJacks != "undefined" && p.inputJacks != null && p.inputJacks.length > 0) {
        //pedalboard.currentState = "removingJack";
      //}
  }  else {
    // dragging a pedal
    pedalboard.currentState = "draggingPedal";

    let draggableElementClicked = e.target;
    pedalboard.currentDraggablePedal = pedalboard.getPedalFromHtmlElem(draggableElementClicked);
    let p = pedalboard.currentDraggablePedal;
    
    if(p === undefined) return;
  
    p.beforeDragPosX = draggableElementClicked.offsetLeft;
    p.beforeDragPosY = draggableElementClicked.offsetTop;
  
  }
  // Keep track of mouse clicked pos (source position)
  oldMousePosX = e.clientX;
  oldMousePosY = e.clientY;

}

function mouseMoveDraggable(e){
  switch(pedalboard.currentState) {
    case "drawingNewJack":
      let jackWeAreDragging = pedalboard.currentDraggableJack;
      updateSVGJack(jackWeAreDragging, jackWeAreDragging.x1, jackWeAreDragging.y1, e.clientX, e.clientY)
      break;
    case "draggingPedal":
        // deplacement souris incrémental
        let dx = (e.clientX - oldMousePosX);
        let dy = (e.clientY - oldMousePosY);
    
        // test obligatoire car on pourrait cliquer
        // sur les input ou output ou boutons rotatifs etc.
        if(pedalboard.currentDraggablePedal !== undefined) {
          let p = pedalboard.currentDraggablePedal;
          p.move(p.beforeDragPosX + dx, p.beforeDragPosY + dy)
        }

      break;
  }
}

function detectLeftButton(evt) {
  evt = evt || window.event;
  if ("buttons" in evt) {
    return evt.buttons == 1;
  }
  var button = evt.which || evt.button;
  return button == 1;
}