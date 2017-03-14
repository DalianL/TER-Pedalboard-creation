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
    this.outputOffsetX = this.w+2*this.IOsize+4;
    this.outputOffsetY = this.IOsize;
    
    
    this.elem = document.createElement("div");
    this.elem.classList.add("draggable");
    this.elem.id = this.id;
    // makes labels not selectable
    // otherwise makes dran'n'drop and clone
    // possible by default
    this.elem.style.userSelect = "none";
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
    this.output.classList.add("output");
    this.output.style.left = this.outputOffsetX+"px"; // relative to parent
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
  
  removeJackAtInput() {
    this.inputJacks.pop();
  }

  removeJackAtOutput() {
    this.outputJacks.pop();
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
      this.input.style.backgroundColor = null;
    
    this.inputHighlighted = flag;
  }

  highLightOutput(flag) {
    if(flag)
       this.output.style.backgroundColor = "red";
    else
      this.output.style.backgroundColor = null;
    
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
      x: this.x + this.IOsize/2 +  this.outputOffsetX,
      y: this.y + this.IOsize/2 +  this.outputOffsetY
    }
  }
}

// DRAG N DROP de pedales
function pedalDragStart(event) {
  console.log("pedal drag start");
  event.dataTransfer.setData("pedalId", event.target.id);
}

function dropPedalHandler(event) {
  var id = event.dataTransfer.getData("pedalId");
  console.log("pedal dropped id = " + 
             id + "x = " + event.clientX);
  // ICI GENERER UN ID UNIQUE !!! il peut y avoir plusieurs instances
  // de la même pédale
  let p = new Pedal(id, event.clientX-30, event.clientY-50, 30, 50);
  pedalboard.addPedal(p)
}