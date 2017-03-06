class Pedal {

  constructor(id, x, y, w, h) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.inputJacks = [];
    this.outputJacks = [];
    // relative position of input and output
    this.IOsize = 15;
    this.inputOffsetX = -this.IOsize/2;
    this.inputOffsetY = this.IOsize;
    this.outputOffsetX = 2*this.IOsize+4;
    this.outputOffsetY = this.IOsize;
    
    
    this.elem = document.createElement("div");
    this.elem.classList.add("draggable");
    this.elem.id = this.id;
    this.elem.style.left = this.x + "px";
    this.elem.style.top = this.y + "px";
    this.elem.style.width = this.w + "px";
    this.elem.style.height = this.h + "px";
    this.elem.innerHTML = this.id;
    
    // input and output
    this.input = document.createElement("div");;
    this.input.classList.add("input");
    this.input.style.left = this.inputOffsetX + "px"; // relative to parent
    this.input.style.top = this.inputOffsetY + "px";

    
    this.output = document.createElement("div");;
    this.output.classList.add("input");
    this.output.style.left = this.w+this.outputOffsetX+"px"; // relative to parent
    this.output.style.top = this.inputOffsetY + "px";
    
    // add input and output to the body
    this.elem.appendChild(this.input);
    this.elem.appendChild(this.output);
  }
  
  addJackAtInput(jack) {
    this.inputJacks.push(jack);
  }
  
  addJackAtOutput(jack) {
    this.outputJacks.push(jack);
  }
  
  set pedalboard(p) {
    // set the pedalboard.elem as the HTML
    // parent of this pedal
    this.parent = p.elem;
    // add the HTML elem of this pedal to
    // the HTML parent
    this.parent.appendChild(this.elem);
  }
  
  move(x, y) {
    this.elem.style.left = x + "px";
    this.elem.style.top = y + "px";
    this.x = x;
    this.y = y;
    
    // Update jacks
    this.inputJacks.forEach(function(j) {
      j.update();
    });
    this.outputJacks.forEach(function(j) {
      j.update();
    });
  }
  
  highLightInput(flag) {
    if(flag)
       this.input.style.backgroundColor = "red";
    else
      this.input.style.backgroundColor = "black";
    
    this.inputHighlighted = flag;
  }

  highLightOutput(flag) {
    if(flag)
       this.output.style.backgroundColor = "red";
    else
      this.output.style.backgroundColor = "black";
    
    this.outputHighlighted = flag;
  }

  getInputPos() {
    return {
      x: this.x +  this.IOsize/2 + this.inputOffsetX,
      y: this.y + this.IOsize/2 + this.inputOffsetY
    }
  }
  
  getOutputPos() {
    return {
      x: this.x + this.IOsize/2 + this.w + this.outputOffsetX,
      y: this.y + this.IOsize/2 +  this.outputOffsetY
    }
  }
}

