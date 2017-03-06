function highlightInputsOutputs(e) {
  let rect = pedalboard.elem.getBoundingClientRect();
  let mouseX = e.x - rect.left;
  let mouseY = e.y - rect.top;
  let closest = pedalboard.findClosestIO(mouseX, mouseY);
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
    svg.appendChild(shape1);
    this.elem1 = shape1;
    
    // Main colored mid wire
    shape2.setAttributeNS(null, "d", path);
    shape2.setAttributeNS(null, "fill", "none");
    shape2.setAttributeNS(null, "stroke", "#8e457d");
    shape2.setAttributeNS(null, "stroke-width",6);
    shape2.setAttributeNS(null, "class", "wire");
    svg.appendChild(shape2);
    this.elem2 = shape2;

    // Specular color in the middle
    shape3.setAttributeNS(null, "d", path);
    shape3.setAttributeNS(null, "fill", "none");
    shape3.setAttributeNS(null, "stroke", "#b87595");
    shape3.setAttributeNS(null, "stroke-width",2);
    shape3.setAttributeNS(null, "class", "wire");
    svg.appendChild(shape3);
    this.elem3 = shape3;
  }
  
  update() {
      let oPos = this.p1.getOutputPos();
      let x1 = oPos.x, y1 = oPos.y;
      let iPos = this.p2.getInputPos();
      let x2 = iPos.x, y2 = iPos.y;

      let jack1 = this.elem1;
      let jack2 = this.elem2;
      let jack3 = this.elem3;

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
  }
}
