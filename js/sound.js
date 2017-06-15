var pzContext;
var mediaSource;
var audioDestination;
var mediaSourceM;
var mediaSRC;
var state = 0;



function soundHandler() {
  let soundSample = document.querySelector('#soundSample');
  pzContext = Pizzicato.context;
  mediaSource = pzContext.createMediaElementSource(soundSample);
  audioDestination = pzContext.destination;

  // Method 1 to connect source to destination
  //pzContext.createMediaElementSource(soundSample).connect(pedal.soundNodeIn);
  //pedal.soundNodeOut.connect(pzContext.destination);
  // Method 2 to connect source to destination
  //pedal.connect(pzContext.createMediaElementSource(soundSample),pzContext.destination);


if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');
  navigator.mediaDevices.getUserMedia({ 
  audio: true
  }).then(function(stream) {
      mediaSourceM = pzContext.createMediaStreamSource(stream);
  }).catch(function(err) {
  // handle the error
  console.log(err.name + ": " + err.message);
  });
}

// CHANGE STATE MIC (1) -> DEMO SOUND (0)
    var mic = document.getElementById("mic");
    mic.addEventListener('change', function(e) {
    if(state == 0) { 
      state = 1;
      console.log(state);
    }
    else { 
      state = 0;
      console.log(state);
    }
  });

};

function soundNodeConnection(p1,p2) {
  if (p1.id == "pedalIn" && p2.id == "pedalOut") {

    // Check state
    if(state == 0) { mediaSource.connect(audioDestination); }
    else { mediaSourceM.connect(audioDestination); }
    
  } else if (p1.id == "pedalIn") {

    if(state == 0) { mediaSource.connect(p2.elem.soundNodeIn); }
    else { mediaSourceM.connect(p2.elem.soundNodeIn); }

  } else if (p2.id == "pedalOut") {
    p1.elem.soundNodeOut.connect(audioDestination);
  } else {
    p1.elem.soundNodeOut.connect(p2.elem.soundNodeIn);
  }
}

function soundNodeDisconnection(p1,p2) {
  if (p1.id == "pedalIn" && p2.id == "pedalOut") {
    // Check state
    if(state == 0) { mediaSource.disconnect(audioDestination); }
    else { mediaSourceM.disconnect(audioDestination); }
    
  } else if (p1.id == "pedalIn") {
    
    if(state == 0) { mediaSource.disconnect(p2.elem.soundNodeIn); }
    else { mediaSourceM.disconnect(p2.elem.soundNodeIn); }
    
  } else if (p2.id == "pedalOut") {
    p1.elem.soundNodeOut.disconnect(audioDestination);
  } else {
    p1.elem.soundNodeOut.disconnect(p2.elem.soundNodeIn);
  }
}

