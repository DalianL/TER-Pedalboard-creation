class Pedal {

  constructor(id, number, x, y, w, h, pedaltype) {
    this.pedalType = pedaltype;
    this.id = id;
    this.number = number;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.inputJacks = [];
    this.outputJacks = [];
    // relative position of input and output
    this.IOsize = 15;
    this.inputOffsetX = -this.IOsize/2;
    this.inputOffsetY = this.IOsize - 4;
    this.outputOffsetX = this.w+2*this.IOsize-2;
    this.outputOffsetY = this.IOsize; 
    
    this.elem = document.createElement(pedaltype);
    this.elem.classList.add("draggable");
    this.elem.id = this.id;
    this.elem.style.left = this.x + "px";
    this.elem.style.top = this.y + "px";
    this.elem.style.width = this.w + "px";
    this.elem.style.height = this.h + "px";
    
    if (this.number != '-1') {
      // menu panel contient les éléments du menu (paramètres, suppression)
      this.menuPanel=document.createElement("div");
      this.menuPanel.className="div_menuPanel";

      // delete
      this.delete = document.createElement("div");
      this.delete.innerHTML += "<a href='#'' onclick=\"pedalboard.removePedal("+this.number+", '"+this.id+"');\"><i class='fa fa-trash' title='Delete pedal'></i></a>";
      this.delete.classList.add("delete");
      // Option menu
      this.optionMenu = document.createElement("div");
      this.optionMenu.innerHTML += "<a href='#'><i class='fa fa-cog' title='Open menu' onclick=\"pedalboard.getSettings("+this.number+", '"+this.id+"');\"></i></a>";
      this.optionMenu.classList.add("optionMenu");

      this.menuPanel.appendChild(this.optionMenu);
      this.menuPanel.appendChild(this.delete);
    }
    
    // input and output
    this.input = document.createElement("div");
    this.input.classList.add("input");
    this.input.style.left = this.inputOffsetX + "px"; // relative to parent
    this.input.style.top = this.inputOffsetY + 1 + "px";
    /*
    if (this.id=="pedalInMic"){
      this.output = document.createElement("img");
      this.output.src=("../img/mic.png");
      this.output.classList.add("pedalInMic");
      this.output.style.top = this.inputOffsetY-100 + "px";
    }else{
      */
      this.output = document.createElement("div");
      this.output.classList.add("output");
      this.output.style.top = this.inputOffsetY + "px";
    //}
    this.output.style.left = this.outputOffsetX + "px"; // relative to parent

    this.output.out = document.createElement("span");
    this.output.out.classList.add("out");
    this.output.out.style.left = this.outputOffsetX + "px"; // relative to parent
    this.output.out.style.top = this.inputOffsetY + "px";
    
    // add pedal to the document
    document.body.append(this.elem);

    // add input and output to the body
    this.elem.appendChild(this.output.out);
    this.elem.appendChild(this.input);
    this.elem.appendChild(this.output);

    if (this.number != '-1') {
      this.elem.appendChild(this.menuPanel);
    }

  }
  
  addJackAtInput(jack) {
    this.inputJacks.push(jack);
  }
  
  addJackAtOutput(jack) {
    this.outputJacks.push(jack);
  }
  
  removeJackAtInput(jack) {
    let index = -1;
    for (j in this.inputJacks) {
      if (this.inputJacks[j].p1 == jack.p1) {
        index = j;
      }
    }
    this.inputJacks.splice(index,1);
  }

  removeJackAtOutput(jack) {
    let index = -1;
    for (j in this.outputJacks) {
      if (this.outputJacks[j].p2 == jack.p2) {
        index = j;
      }
    }
    this.outputJacks.splice(index,1);
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
     this.input.style.backgroundImage = "url('img/inputHover.png')";
   else
    this.input.style.backgroundImage = "url('img/input.png')";

  this.inputHighlighted = flag;
}

highLightOutput(flag) {
  this.outputHighlighted = flag;
}

getInputPos() {
  return {
    x: this.x + this.IOsize/2 + this.inputOffsetX,
    y: this.y + this.IOsize/2 + this.inputOffsetY + 5
  }
}

getOutputPos() {
  return {
    x: this.x + this.IOsize/2 +  this.outputOffsetX,
    y: this.y + this.IOsize/2 +  this.outputOffsetY + 2
  }
}
}

function getTokenPedal() {
  countPedals += 1;
  return countPedals;
}

function updateTokenPedal() {
  countPedals--;
}

function pedalDragStart(event) {
  // console.log("pedal drag start");
  event.dataTransfer.setData("pedalId", event.target.id);
}

function dropPedalHandler(event) {
  var id = event.dataTransfer.getData("pedalId");
  //console.log("pedal dropped id = " + id + "x = " + event.clientX);
  // ICI GENERER UN ID UNIQUE !!! il peut y avoir plusieurs instances
  // de la même pédale
  if (id == "delay" || id == "flanger" || id == "lowpass" || id == "quadra") {
    let p, ptype;
    if (id == "delay") {
      p = new Pedal(id + uniqueID, getTokenPedal(), event.clientX-30-(135/2), event.clientY-10-(110/2), 135, 220, "pedal-delay");
    } else if (id == "flanger") {
      p = new Pedal(id + uniqueID, getTokenPedal(), event.clientX-30-(225/2), event.clientY-40-(245/2), 225, 245, "pedal-flanger");
    } else if (id == "lowpass") {
      p = new Pedal(id + uniqueID, getTokenPedal(), event.clientX-30-(110/2), event.clientY-20-(245/2), 110, 245, "pedal-lowpass");
    } else if (id == "quadra") {
      p = new Pedal(id + uniqueID, getTokenPedal(), event.clientX-30-(135/2), event.clientY-40-(275/2), 135, 275, "pedal-quadrafuzz");
    }

    uniqueID++;
    pedalboard.addPedal(p);

    if (id == "delay") {
      ptype = document.querySelector('pedal-delay');
    } else if (id == "flanger") {
      ptype = document.querySelector('pedal-flanger');
    } else if (id == "lowpass") {
      ptype = document.querySelector('pedal-lowpass');
    } else if (id == "quadra") {
      ptype = document.querySelector('pedal-quadrafuzz');
    }

    ptype.factoryImpl();

  }
  
}