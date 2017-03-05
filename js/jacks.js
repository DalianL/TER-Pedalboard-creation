function highlightInputsOutputs(e) {
  var rect = pedalboard.elem.getBoundingClientRect();
  var mouseX = e.x - rect.left;
  var mouseY = e.y - rect.top;
  var closest = pedalboard.findClosestIO(mouseX, mouseY);
  
  // test animate cable
  updateJack("cable1", p1, p2);
  updateJack("cable2", p2, p3);
  
 }

function resizePedalBoard(evt) {
  var svg = document.getElementById("svg-canvas");
    svg.setAttribute('width', evt.target.clientWidth);
    svg.setAttribute('height', evt.target.clientHeight);
}
function createSVG() {
  var svg = document.getElementById("svg-canvas");
  if (null == svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", 
                                   "svg");
    svg.setAttribute('id', 'svg-canvas');
    svg.setAttribute('style', 'position:absolute;top:0px;left:0px');
    // Should use here pedalboard
    svg.setAttribute('width', document.getElementById("pedalboard").clientWidth);
    svg.setAttribute('height', document.getElementById("pedalboard").clientHeight);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", 
                       "xmlns:xlink", 
                       "http://www.w3.org/1999/xlink");
    // Important to use prepend here instead of appendChild
    // Otherwise cables/jacks will be in front of pedals
    // trashing the GUI + complicating the click
    // and drag implementations (svg will get
    // the mousedown event, not the body of the pedal)
    pedalboard.elem.prepend(svg);
  }
  return svg;
}

function createJack(id, pedal1, pedal2, color) {
  var oPos = pedal1.getOutputPos();
  var x1 = oPos.x, y1 = oPos.y;
  var iPos = pedal2.getInputPos();
  var x2 = iPos.x, y2 = iPos.y;
    
    var svg = createSVG();
    var shape = document.createElementNS("http://www.w3.org/2000/svg", 
                                         "path");
  
    var tension = 1;

  if(x2 < x1) 
    tension = -tension;

    var delta = (x2-x1)*tension;
    var hx1=x1+delta;
    var hy1=y1;
    var hx2=x2-delta;
    var hy2=y2;
    var path = "M "  + x1 + " " + y1 + 
               " C " + hx1 + " " + hy1 +
                     " "  + hx2 + " " + hy2  + 
              " " + x2 + " " + y2;
    shape.setAttributeNS(null, "d", path);
    shape.setAttributeNS(null, "fill", "none");
    shape.setAttributeNS(null, "stroke", color);
    shape.setAttributeNS(null, "stroke-width",2);
    shape.setAttributeNS(null, "id", id);
  svg.appendChild(shape);
}
  
function updateJack(id, pedal1, pedal2) {
  var oPos = pedal1.getOutputPos();
  var x1 = oPos.x, y1 = oPos.y;
  var iPos = pedal2.getInputPos();
  var x2 = iPos.x, y2 = iPos.y;


  var jack = document.querySelector("#"+id);
  var d = jack.getAttribute("d");
  var tension = 1;

  if(x2 < x1) 
    tension = -tension;
  
  var delta = (x2-x1) * tension;
    var hx1=x1+delta;
    var hy1=y1;
    var hx2=x2-delta;
    var hy2=y2;
    var path = "M "  + x1 + " " + y1 + 
               " C " + hx1 + " " + 
               hy1 + " "  + hx2 + " " + hy2 +
               " " + x2 + " " + y2;
  jack.setAttribute("d", path);
}
