window.onload = init;

function init() {  
  pedalboard.init();

  buildMenuPedals();

  let pdb = document.querySelector("#pedalboard");
  let pdbW = parseInt(window.getComputedStyle(pdb).width, 10);
  let pdbH = parseInt(window.getComputedStyle(pdb).height, 10);

  let pIn = new Pedal("pedalIn", -1, -55, -20 + (3*pdbH / 4), 10, 10);
  let pOut = new Pedal("pedalOut", -1, pdbW, -20 + (pdbH / 2), 10, 10);
  // constructor(id, number, x, y, w, h, pedaltype)
  let pInMIC = new Pedal("pedalInMic", -1, -65, -20 + (pdbH / 4), 10, 10);

  pedalboard.addPedal(pIn);
  pedalboard.addPedal(pOut);
  pedalboard.addPedal(pInMIC);

  // Handles the WebAudio graph initialization
  soundHandler();

  // For new pedals to be added
  addNewPedalListeners();

  // For pedals to be draggable
  addDraggableListeners();

  // For the jack menu to appear
  addMenuListerners();

  // For mouse zooming 
  addZoomListener();
}

function buildMenuPedals(){
  let div_tabs=document.querySelector("#div_tabs");
  let tabMenuPedals=["all","delay","distortion","dynamics","filter","generation","modulator","reverb","simulator","spatial","spectral","utility"];
  let input, label, divContent, divPedals, divPedal, span;

  let div_container=document.createElement("div");
  div_container.className="div_container";

  tabMenuPedals.forEach((e,i)=>{
    input=document.createElement("input");
    input.id="tab-"+i;
    input.type="radio";
    input.name="input-tab";
    if (i==1) input.checked="checked";

    label=document.createElement("label");
    label.setAttribute("for","tab-"+i);
    label.appendChild(document.createTextNode(e));

    div_tabs.appendChild(input);
    div_tabs.appendChild(label);

    divContent=document.createElement("div");
    divContent.id="content-"+i;

    divPedals=document.createElement("div");
    divPedals.className="pedals";

    divPedal=document.createElement("div");
    divPedal.id=e;
    divPedal.className="pedal";
    divPedal.setAttribute("draggable",true);

    span=document.createElement("span");
    span.appendChild(document.createTextNode(e));

    divPedals.appendChild(span);
    divPedals.appendChild(divPedal);
    divContent.appendChild(divPedals);
    div_container.appendChild(divContent);
  });

  div_tabs.appendChild(div_container);

}
function addNewPedalListeners() {
  var newPedals = document.querySelectorAll(".pedal");
  for (var i = 0; i < newPedals.length; i++) {
    newPedals[i].addEventListener('dragstart', pedalDragStart, false);
  }
}

function addDraggableListeners() {
  window.addEventListener('mousedown', mouseDownDraggable, false);  

  window.addEventListener('mouseup', mouseUpDraggable, false);  

    // celui-là pour detecter si on est au voisinage des
    // inputs et outputs des pédales
    pedalboard.elem.addEventListener('mousemove', highlightInputsOutputs);
  }

  function addMenuListerners() {
    menu = document.querySelector("#context-menuJack"); 
    divs = document.querySelectorAll(".input");
    menuState = 0;

    divs.forEach(function(d) {
      handleJackMenu(d);
      resizeListener(d);
    })
  }

  function addZoomListener() {
    elem = document.querySelector('#pedalboard');
  // IE9, Chrome, Safari, Opera
  elem.addEventListener("mousewheel", mouseWheelHandler, false);
  // Firefox
  elem.addEventListener("DOMMouseScroll", mouseWheelHandler, false);
}

function resizeListener (elem) {
  window.onresize = function(e) {
    // Hide menu if the window is resized
    toggleMenuOff();

    // Repositions the pedal located on the right 
    // according to the new width
    let pdb = document.querySelector("#pedalboard");
    let pdbW = parseInt(window.getComputedStyle(pdb).width, 10);
    let pdbH = parseInt(window.getComputedStyle(pdb).height, 10);
    pedalboard.pedals[1].move(pdbW, -20 + (pdbH / 2));

  }
}