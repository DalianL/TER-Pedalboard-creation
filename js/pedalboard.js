function resizePedalBoard(evt) {
  let svg = document.getElementById("svg-canvas");
  svg.setAttribute('width', pedalboard.elem.clientWidth);
  svg.setAttribute('height', pedalboard.elem.clientHeight);
  console.log("resize");
}

function createSVGcanvas(parent) {
  let svg = document.getElementById("svg-canvas");
  if (null == svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", 
                                   "svg");
    svg.setAttribute('id', 'svg-canvas');
    svg.setAttribute('style', 'position:absolute;top:0px;left:0px');
    // Should use here pedalboard
    svg.setAttribute('width', parent.clientWidth);
    svg.setAttribute('height', parent.clientHeight);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", 
                       "xmlns:xlink", 
                       "http://www.w3.org/1999/xlink");
    // Important to use prepend here instead of appendChild
    // Otherwise cables/jacks will be in front of pedals
    // trashing the GUI + complicating the click
    // and drag implementations (svg will get
    // the mousedown event, not the body of the pedal)
    parent.prepend(svg);
  }
  return svg;
}

let pedalboard ={
  elem:undefined,
  pedals:[],
  // the svgcanvas
  svgcanvas: undefined,
  currentState : "none",
  
  init: function() {
    this.elem = document.querySelector("#pedalboard");
    svgcanvas = createSVGcanvas(this.elem);
  },
  
  addPedal:function(p) {
    this.pedals.push(p);
    p.pedalboard = this;
  },
  connect: function(p1, p2) {
    var jack = new Jack(p1, p2);
    p1.addJackAtOutput(jack);
    p2.addJackAtInput(jack);
  },
  
  getPedalFromHtmlElem: function(elem) {
    for(var i = 0; i < this.pedals.length; i++) {
      var p = this.pedals[i];
      if(p.elem === elem) {
        return p;
      }
    }
    return undefined;
  },
  
  findClosestIO: function(x, y) {
      this.pedals.forEach(function(p) {
        let iPos = p.getInputPos();
        let oPos = p.getOutputPos();
        let distInput = distance(x, y, iPos.x, iPos.y);
        let distOutput = distance(x, y, oPos.x, oPos.y);

        if(distInput < 20) {
          if(!p.inputHighlighted) {
             p.highLightInput(true);
          }
        } else {
          if(p.inputHighlighted) {
             p.highLightInput(false);
          }
        }
        
        if(distOutput < 20) {
          if(!p.outputHighlighted) {
             p.highLightOutput(true);
          }
        } else {
          if(p.outputHighlighted) {
             p.highLightOutput(false);
          }
        }

      });
  },
  
  findPedalWhoseOutputIsHighlighted: function() {
    for(var i=0; i < this.pedals.length; i++) {
      let p = this.pedals[i];
      if(p.outputHighlighted) return p;
    }
  },
  
  findPedalWhoseInputIsHighlighted: function() {
    for(var i=0; i < this.pedals.length; i++) {
      let p = this.pedals[i];
      if(p.inputHighlighted) return p;
    }
  }
};