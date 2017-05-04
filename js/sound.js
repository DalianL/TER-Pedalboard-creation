var pzContext;
var gainExample;
var pedal;

window.onload = function() {
  pzContext = Pizzicato.context;
  pedal = document.querySelector('pedal-delay');
  pedal.factoryImpl();

  gainExample = document.querySelector('#gainExample');
  pedal.connect(pzContext.createMediaElementSource(gainExample),pzContext.destination);

};