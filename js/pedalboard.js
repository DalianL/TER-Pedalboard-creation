// To know when the zoom is enabled
var zoom = 0;

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
    handleJackMenu(p.input);
    resizeListener(p.input);
  },

  connect: function(p1, p2) {
    var jack = new Jack(p1, p2);
    p1.addJackAtOutput(jack);
    p2.addJackAtInput(jack);
  },

  disconnect : function(p1, p2) {
    for (j in p1.outputJacks) {
      if (p1.outputJacks[j].p2 == p2) {
        p1.removeJackAtOutput(p1.outputJacks[j]);
      }
    }
    for (j in p2.inputJacks) {
      if (p2.inputJacks[j].p1 == p1) {
        p2.removeJackAtInput(p2.inputJacks[j]);
      }
    }

    // removes all components of the SVG Jack, 
    // here 3 drawings on top of each other
    for(var i=1; i <= 4; i++) {
      var elem = document.getElementById("jack"+p1.id+p2.id+"_"+i);
      if (elem != null) elem.parentNode.removeChild(elem);
    }
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
      let self = this;

      // Adapts the coordinates according to zoom activation
      // and the width of the jack
      x = (-16 * (zoom + 1)) + x / (zoom + 1);
      y = y / (zoom + 1);

      this.pedals.forEach(function(p) {
        // be careful here this is not the pedalboard,
        // we're in a forEach callback, remember the trap
        // I talked into the course !!!! This is why we use
        // self = this just before !
        let iPos = p.getInputPos();
        let oPos = p.getOutputPos();
        
        let distInput;
        let distMinToInputForHighlight = 20;
        if(self.currentState === "drawingNewJack") {
          // We must highlight the pedal input taking
          // into account the length of the jack ending
          // (an image of 100px width)
          distInput = distance(x, y, iPos.x-50, iPos.y);
          distMinToInputForHighlight = 50;
        } else {
          // regular case, we're just pointing the mouse around
          distInput = distance(x, y, iPos.x, iPos.y);
        }
        
        let distOutput= distance(x, y, oPos.x, oPos.y);

        // It depends if we're trying to plug a jack or not
        if(distInput < distMinToInputForHighlight) {
          if(!p.inputHighlighted) {
            p.highLightInput(true);
          }
        } else {
          if(p.inputHighlighted) {
            p.highLightInput(false);
          }
        }
        
        if(distOutput < 30) {
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
  },
  
  rescale(s) {
    this.elem.style = 'transform(' + s + ',' + s + ')';
  }
};

function mouseWheelHandler(e) {
  e.preventDefault();

  let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

  let boardC = document.querySelector('#pedalboard-container');
  let board = document.querySelector('#pedalboard');
  let boardWid = parseInt(window.getComputedStyle(board).width, 10);
  let boardHei = parseInt(window.getComputedStyle(board).height, 10);

  if(delta == 1) {
    zoom = 1;
    board.style.transform = 'scale(2,2)';

    if (e.clientY < boardHei / 3) {
      if (e.clientX < boardWid / 3) {
        board.style.transformOrigin = 'left top';
      } else if (e.clientX < 2 * (boardWid / 3)) {
        board.style.transformOrigin = 'center top';
      } else {
        board.style.transformOrigin = 'right top';
      }
    } else if (e.clientY < 2 * (boardHei / 3)) {
      if (e.clientX < boardWid / 3) {
        board.style.transformOrigin = 'left center';
      } else if (e.clientX < 2 * (boardWid / 3)) {
        board.style.transformOrigin = 'center center';
      } else {
        board.style.transformOrigin = 'right center';
      }
    } else {
      if (e.clientX < boardWid / 3) {
        board.style.transformOrigin = 'left bottom';
      } else if (e.clientX < 2 * (boardWid / 3)) {
        board.style.transformOrigin = 'center bottom';
      } else {
        board.style.transformOrigin = 'right bottom';
      }
    }
  } 

  if (delta == -1) {
    zoom = 0;
    board.style.transform = '';
  }

  toggleMenuOff();

}