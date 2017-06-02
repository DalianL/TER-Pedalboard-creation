let oldMousePosX, oldMousePosY;

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
    case "draggingPedal":
      break;
    case "draggingPedalboard":
      break;
    }
    // set back pedalboard state to "none", we finished a drag
    pedalboard.currentState = "none";
}

function mouseDownDraggable(e) {
  // Computes the location of the mouse in the SVG canvas
  var loc = cursorPoint(e);

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

    pedalboard.currentDraggableJack = createBezierSVGJack("tmpJack", x1, y1, loc.x, loc.y);
    pedalboard.currentDraggableJack.sourcePedal = p;
    pedalboard.currentDraggableJack.end.setAttribute("x", loc.x - 7);
    pedalboard.currentDraggableJack.end.setAttribute("y", loc.y - 10);
    pedalboard.currentDraggableJack.x1 = x1;
    pedalboard.currentDraggableJack.y1 = y1;

  } else if ((p = pedalboard.findPedalWhoseInputIsHighlighted()) !== undefined) {
    pedalMenu = p;
    if (p.inputJacks.length == 1) {
      let sourcePedal = p.inputJacks[0].p1;
      // first we disconnect the jack before immediatly creating
      // a new one to drag
      pedalboard.disconnect(sourcePedal, p);
      pedalboard.currentState = "drawingNewJack";
      let x1 = sourcePedal.getOutputPos().x;
      let y1 = sourcePedal.getOutputPos().y;

      pedalboard.currentDraggableJack = createBezierSVGJack("tmpJack", x1, y1, loc.x, loc.y);
      pedalboard.currentDraggableJack.sourcePedal = sourcePedal;
      pedalboard.currentDraggableJack.end.setAttribute("x", loc.x - 7);
      pedalboard.currentDraggableJack.end.setAttribute("y", loc.y - 10);
      pedalboard.currentDraggableJack.x1 = x1;
      pedalboard.currentDraggableJack.y1 = y1;
    }
  } else if (clickInPedal(e)) {
    // dragging a pedal
    pedalboard.currentState = "draggingPedal";

    let draggableElementClicked = e.target;
    pedalboard.currentDraggablePedal = pedalboard.getPedalFromHtmlElem(draggableElementClicked);
    let p = pedalboard.currentDraggablePedal;
    
    if(p === undefined) return;
  
    p.beforeDragPosX = draggableElementClicked.offsetLeft;
    p.beforeDragPosY = draggableElementClicked.offsetTop;
  
  } else if (loc.x < parseInt(window.getComputedStyle(pedalboard.elem).width, 10) && 
    loc.y < parseInt(window.getComputedStyle(pedalboard.elem).height, 10)) {
    // dragging the pedalboard
    pedalboard.currentState = "draggingPedalboard";
  }
  // Keep track of mouse clicked pos (source position)
  oldMousePosX = loc.x;
  oldMousePosY = loc.y;
}

function mouseMoveDraggable(e) {
  // Computes the location of the mouse in the SVG canvas
  var loc = cursorPoint(e);
  // deplacement souris incrémental 
  let dx = (loc.x - oldMousePosX);
  let dy = (loc.y - oldMousePosY);

  switch(pedalboard.currentState) {
    case "drawingNewJack":
      let jackWeAreDragging = pedalboard.currentDraggableJack;
      updateSVGJack(jackWeAreDragging, jackWeAreDragging.x1, jackWeAreDragging.y1, loc.x, loc.y)
      break;
    case "draggingPedal":
      // test obligatoire car on pourrait cliquer
      // sur les input ou output ou boutons rotatifs etc.
      if(pedalboard.currentDraggablePedal !== undefined) {
        let p = pedalboard.currentDraggablePedal;
        p.move(p.beforeDragPosX + dx, p.beforeDragPosY + dy)
      }
      break;
    case "draggingPedalboard":
      pedalboard.move(dx, dy);
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

function cursorPoint(evt){
  let svg = document.querySelector('#svg-canvas');
  let pt = svg.createSVGPoint();
  pt.x = evt.clientX; 
  pt.y = evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function clickInPedal(e) {
  pedals = document.querySelectorAll('.draggable');

  let loc = cursorPoint(e);
  let result = false;

  pedals.forEach(function (d) {
    pedal = pedalboard.getPedalFromHtmlElem(d);
    if (loc.x > pedal.x && loc.x < pedal.x + pedal.w * 1.25 && loc.y > pedal.y && loc.y < pedal.y + pedal.h * 1.25) {
      result = true;
    }
  });

  return result;
}