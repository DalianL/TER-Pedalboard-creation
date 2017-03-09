function highlightInputsOutputs(e) {
  let rect = pedalboard.elem.getBoundingClientRect();
  let mouseX = e.x - rect.left;
  let mouseY = e.y - rect.top;
  let closest = pedalboard.findClosestIO(mouseX, mouseY);
 }

function createBezierSVGJack(id, x1, y1, x2, y2) {
    let svg = createSVGcanvas();
    let shape1 = document.createElementNS("http://www.w3.org/2000/svg", 
                                         "path");
    let shape2 = document.createElementNS("http://www.w3.org/2000/svg", 
                                         "path");
    let shape3 = document.createElementNS("http://www.w3.org/2000/svg", 
                                         "path");
    let tension = 1;

    // if pedal 2 on the left of pedal 1
    if(x2 < x1) 
      tension = -tension;

    let delta = (x2-x1)*tension;
    let hx1=x1+delta;
    let hy1=y1;
    let hx2=x2-delta;
    let hy2=y2;
    let path = "M "  + x1 + " " + y1 + 
               " C " + hx1 + " " + hy1 +
               " "  + hx2 + " " + hy2  + 
               " " + x2 + " " + y2;
    
    // External wire
    shape1.setAttributeNS(null, "d", path);
    shape1.setAttributeNS(null, "fill", "none");
    shape1.setAttributeNS(null, "stroke", "#471221");
    shape1.setAttributeNS(null, "stroke-width",10);
    shape1.setAttributeNS(null, "class", "wire");
    shape1.setAttributeNS(null, "id", id+"_1");
    svg.appendChild(shape1);
    
    // Main colored mid wire
    shape2.setAttributeNS(null, "d", path);
    shape2.setAttributeNS(null, "fill", "none");
    shape2.setAttributeNS(null, "stroke", "#8e457d");
    shape2.setAttributeNS(null, "stroke-width",6);
    shape2.setAttributeNS(null, "class", "wire");
    shape2.setAttributeNS(null, "id", id+"_2");

    svg.appendChild(shape2);

    // Specular color in the middle
    shape3.setAttributeNS(null, "d", path);
    shape3.setAttributeNS(null, "fill", "none");
    shape3.setAttributeNS(null, "stroke", "#b87595");
    shape3.setAttributeNS(null, "stroke-width",2);
    shape3.setAttributeNS(null, "class", "wire");
    shape3.setAttributeNS(null, "id", id+"_3");

    svg.appendChild(shape3);
  
    return {
      elem1: shape1,
      elem2: shape2,
      elem3: shape3
    }
}

function updateSVGJack(jack, x1, y1, x2, y2) {
      let jack1 = jack.elem1;
      let jack2 = jack.elem2;
      let jack3 = jack.elem3;

      let d = jack1.getAttribute("d");
      let tension = 1;

      if(x2 < x1) 
          tension = -tension;
  
      let delta = (x2-x1) * tension;
      let hx1=x1+delta;
      let hy1=y1;
      let hx2=x2-delta;
      let hy2=y2;
      let path = "M "  + x1 + " " + y1 + 
               " C " + hx1 + " " + 
               hy1 + " "  + hx2 + " " + hy2 +
               " " + x2 + " " + y2;
      jack1.setAttribute("d", path);
      jack2.setAttribute("d", path);
      jack3.setAttribute("d", path);
  
      return jack;
}

class Jack {
  constructor(pedal1, pedal2) {
    this.p1 = pedal1;
    this.p2 = pedal2;
    
    // Compute the svg for this jack
    let oPos = pedal1.getOutputPos();
    let x1 = oPos.x, y1 = oPos.y;
    let iPos = pedal2.getInputPos();
    let x2 = iPos.x, y2 = iPos.y;
    
    this.jackSVG = createBezierSVGJack("jack" + 
                                       pedal1.elem.id + 
                                       pedal2.elem.id,
                                       x1, y1, x2, y2);
  }
  
  update() {
      let oPos = this.p1.getOutputPos();
      let x1 = oPos.x, y1 = oPos.y;
      let iPos = this.p2.getInputPos();
      let x2 = iPos.x, y2 = iPos.y;

      updateSVGJack(this.jackSVG, x1, y1, x2, y2);
  }
}
