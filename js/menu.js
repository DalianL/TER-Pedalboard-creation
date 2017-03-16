/**
* Created by ThiernoMamadouCellou on 3/1/2017.
*/

/* menu learn  */
var menu;
var id;
var taskItemClassName = "knob"; //{type:String,value: "knob"},
var contextMenuLinkClassName = "context-menu__link"; // {type:String,value:"context-menu__link"},
var contextMenuActive = "context-menu--active";//  {type:String,value:"context-menu--active"},
var menuState = 0;// {type:Number,value:0},
var menuWidth ; // {type:Number,value:null},
var menuHeight ; // {type:Number,value:null},
var windowWidth ;// {type:Number,value:null},
//windowHeigth: {type:Number,value:null},
var taskItemInContext ; //{type:String,value:null},
var clickCoords ; // {type:Number,value:null},
var clickCoordsX ; // {type:Number,value:null},
var clickCoordsY ; //{type:Number,value:null},
var learn = "true";

function clickInsideElement( e, className ) {
  var el = e.srcElement || e.target;
  if ( el.classList.contains(className) || el.tagName.startsWith("WEBAUDIO")) {
    return el;
  } else {
    while ( el = el.parentNode ) {
      if ( el.classList && el.classList.contains(className) || el.tagName.startsWith("WEBAUDIO")) {
        return el;
      }
    }
  }
  return false;
}

function contextListener() {
  if(learn === 'true') {
    document.getElementById(id).addEventListener("contextmenu", function (e) {
      taskItemInContext = clickInsideElement(e, taskItemClassName);
      console.log(taskItemInContext);
      if (taskItemInContext) {
        e.preventDefault();
        toggleMenuOn();
        positionMenu(e);
      } else {
        taskItemInContext = null;
        toggleMenuOff();
      }
    });
  }
}

 function clickListener() {
  document.getElementById(id).addEventListener( "click", function(e) {
    var el = e.srcElement || e.target;
    var clickeElIsLink = clickInsideElement( e, contextMenuLinkClassName );
    console.log(clickeElIsLink);
    if ( clickeElIsLink ) {
      e.preventDefault();
      menuItemListener( clickeElIsLink );
    } else {
      var button = e.which || e.button;
      if ( button === 1 ) {
        toggleMenuOff();
      }
    }
  });
}

 function keyupListener() {
  window.onkeyup = function(e) {
    if ( e.keyCode === 27 ) {
      toggleMenuOff();
    }
  }
}

 function resizeListener() {
  window.onresize = function(e) {
    toggleMenuOff();
  };
}

 function toggleMenuOn() {
  if ( menuState !== 1 ) {
    menuState = 1;
    menu.classList.add(contextMenuActive);
  }
}
function toggleMenuOff() {
  if ( menuState !== 0 ) {
    menuState = 0;
    menu.classList.remove(contextMenuActive);
  }
}

function getPosition(e) {
  var posx = 0;
  var posy = 0;

  if (!e) var e = window.event;

  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft +
      document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop +
      document.documentElement.scrollTop;
  }

  return {
    x: posx - 480,
    y: posy - 380
  }
}

function  positionMenu(e) {
  clickCoords = getPosition(e);
  clickCoordsX = clickCoords.x;
  clickCoordsY = clickCoords.y;

  menuWidth = menu.offsetWidth + 4;
  menuHeight = menu.offsetHeight + 4;

  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  if ((windowWidth - clickCoordsX) < menuWidth) {
    menu.style.left = windowWidth - menuWidth + "px";
  } else {
    menu.style.left = clickCoordsX + "px";
  }

  if ((windowHeight - clickCoordsY) < menuHeight) {
    menu.style.top = windowHeight - menuHeight + "px";
  } else {
    menu.style.top = clickCoordsY + "px";
  }
}

function menuItemListener ( link ) {
  console.log(link.getAttribute("data-action"));
  console.log(id);
  document.querySelector("#"+taskItemInContext.getAttribute("id")).midiMessage(link);
  console.log( "Task ID - " +
    taskItemInContext.getAttribute('id') +
    ", Task action - " + link.getAttribute("data-action"));
  toggleMenuOff();
}
