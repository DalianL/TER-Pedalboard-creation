// A mettre dans drag.js
let beforeDragPosX, beforeDragPosY;
let oldMousePosX, oldMousePosY
let draggableElementClicked;
let currentDraggablePedal;

function mouseUpDraggable() {
    window.removeEventListener('mousemove', mouseMoveDraggable, true);
}

function mouseDownDraggable(e){
  // Quand on clique on mémorise : 1) l'ancienne position
  // de l'objet qu'on draggue et 2) l'ancienne position de
  // la souris (la position cliquee) et 3) on ajoute un 
  // mousemove listener
  window.addEventListener('mousemove', mouseMoveDraggable, true);
  draggableElementClicked = e.target;
  currentDraggablePedal = pedalboard.getPedalFromHtmlElem(draggableElementClicked);

  if(currentDraggablePedal === undefined) return;
  
  beforeDragPosX = draggableElementClicked.offsetLeft;
  beforeDragPosY = draggableElementClicked.offsetTop;
  
  oldMousePosX = e.clientX;
  oldMousePosY = e.clientY;
}

function mouseMoveDraggable(e){
    // deplacement souris incrémental
    let dx = (e.clientX - oldMousePosX);
    let dy = (e.clientY - oldMousePosY);
    
  // test obligatoire car on pourrait cliquer
  // sur les input ou output ou boutons rotatifs etc.
  if(currentDraggablePedal !== undefined)
    currentDraggablePedal.move(beforeDragPosX + dx, beforeDragPosY + dy)
}