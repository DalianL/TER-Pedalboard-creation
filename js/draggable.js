window.onload = addListeners;

function addListeners() {
  // Add a mousedown listener to all draggable elements
  var listOfDraggable = document.querySelectorAll(".draggable");
  listOfDraggable.forEach(function(e) {
     e.addEventListener('mousedown', mouseDownDraggable, false);
  });

  window.addEventListener('mouseup', mouseUpDraggable, false);

  addMenuListerners();
}

function mouseUpDraggable() {
    window.removeEventListener('mousemove', mouseMoveDraggable, true);
}

var beforeDragPosX, beforeDragPosY;
var oldMousePosX, oldMousePosY

function mouseDownDraggable(e){
  // Quand on clique on mémorise : 1) l'ancienne position
  // de l'objet qu'on draggue et 2) l'ancienne position de
  // la souris (la position cliquee) et 3) on ajoute un 
  // mousemove listener
  window.addEventListener('mousemove', mouseMoveDraggable, true);
  var draggableElementClicked = event.target;
  beforeDragPosX = draggableElementClicked.offsetLeft;
  beforeDragPosY = draggableElementClicked.offsetTop;
  
  oldMousePosX = e.clientX;
  oldMousePosY = e.clientY;
}

function mouseMoveDraggable(e){
    // deplacement souris incrémental
    var dx = (e.clientX - oldMousePosX);
    var dy = (e.clientY - oldMousePosY);
    
    var draggableElementClicked = event.target;
    draggableElementClicked.style.top  = (beforeDragPosY + dy) + "px";
    draggableElementClicked.style.left =  (beforeDragPosX + dx) + "px";
}
