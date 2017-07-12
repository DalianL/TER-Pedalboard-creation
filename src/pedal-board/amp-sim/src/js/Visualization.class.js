class Visualization {
  constructor() {
    this.canvas;
    this.audioContext;
    this.canvasContext;
    this.gradient;
    this.analyser;
    this.width;
    this.height;
    this.analyzer;
    this.dataArray;
    this.bufferLength;
  }

  configure(canvasElt, analzr) {
    this.analyzer = analzr;
    this.canvas = canvasElt;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.canvasContext = this.canvas.getContext('2d');
    // create a vertical gradient of the height of the canvas
    this.gradient = this.canvasContext.createLinearGradient(0, 0, 0, this.height);
    this.gradient.addColorStop(0, '#000000');
    this.gradient.addColorStop(0.25, '#ff0000');
    this.gradient.addColorStop(0.75, '#ffff00');
    this.gradient.addColorStop(1, '#00FF00');
    //buildAudioGraph();
    // Try changing for lower values: 512, 256, 128, 64...
    this.analyzer.fftSize = 1024;
    this.bufferLength = this.analyzer.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
  };

  clearCanvas() {
    this.canvasContext.save();
    // clear the canvas
    // like this: canvasContext.clearRect(0, 0, width, height);
    // Or use rgba fill to give a slight blur effect
    this.canvasContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.canvasContext.fillRect(0, 0, this.width, this.height);
    this.canvasContext.restore();
  }

  update() {
    this.clearCanvas();
    this.drawVolumeMeter();
    this.drawWaveform();
  }

  drawWaveform() {
    this.canvasContext.save();
    // Get the analyser data
    this.analyzer.getByteTimeDomainData(this.dataArray);
    this.canvasContext.lineWidth = 2;
    this.canvasContext.strokeStyle = 'lightBlue';
    // all the waveform is in one single path, first let's
    // clear any previous path that could be in the buffer
    this.canvasContext.beginPath();
    var sliceWidth = this.width / this.bufferLength;
    var x = 0;
    // values go from 0 to 256 and the canvas heigt is 100. Let's rescale
    // before drawing. This is the scale factor
    var heightScale = this.height / 128;
    for (var i = 0; i < this.bufferLength; i++) {
      // dataArray[i] between 0 and 255
      var v = this.dataArray[i] / 255;
      var y = v * this.height;
      if (i === 0) {
        this.canvasContext.moveTo(x, y);
      } else {
        this.canvasContext.lineTo(x, y);
      }
      x += sliceWidth;
    }
    this.canvasContext.lineTo(this.canvas.width, this.canvas.height / 2);
    // draw the path at once
    this.canvasContext.stroke();
    this.canvasContext.restore();
  }

  drawVolumeMeter() {
    this.canvasContext.save();
    this.analyzer.getByteFrequencyData(this.dataArray);
    var average = this.getAverageVolume(this.dataArray);
    // set the fill style to a nice gradient
    this.canvasContext.fillStyle = this.gradient;
    // draw the vertical meter
    var value = Math.max(this.height - average * 0.5, 0)
    this.canvasContext.fillRect(0, value, 25, this.height);
    this.canvasContext.restore();
  }

  getAverageVolume(array) {
    var values = 0,
      average = 0,
      length = array.length;
    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
      values += array[i];
    }
    average = values / length;
    return average;
  }
}