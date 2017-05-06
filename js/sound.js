var pzContext;
var mediaSource;
var audioDestination;

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

};

function enablePedalEffect(p) {
  mediaSource.connect(p.elem.soundNodeIn);
}

function enableAudio(p) {
  p.elem.soundNodeOut.connect(audioDestination);
}

function connectAudioNodes(p1,p2) {
  p1.elem.soundNodeOut.connect(p2.elem.soundNodeIn);
}