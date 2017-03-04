function highlightInputsOutputs(e) {
  var rect = pedalboard.elem.getBoundingClientRect();
  var mouseX = e.x - rect.left;
  var mouseY = e.y - rect.top;
  var closest = pedalboard.findClosestIO(mouseX, mouseY);
}