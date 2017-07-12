// --------- CURVE DRAWER -------
class CurveDrawer {
  constructor(canvasElt) {
    this.canvas = canvasElt;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.curve = [];
    this.drawAxis();
  }

  drawAxis() {
    this.ctx.save();
    this.ctx.strokeStyle = '#ccc';
    this.ctx.lineWidth = 1;
    // x axis
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height / 2);
    this.ctx.lineTo(this.width, this.height / 2);
    this.ctx.stroke();
    // y axis
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.width / 2, this.height);
    this.ctx.stroke();
    this.ctx.restore();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawCurve(color, lineWidth) {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(this.height, (this.curve[0] + 1) * this.width / 2);
    for (var i = 0; i < this.width; i++) {
      var x = this.height - i;
      var y = (this.curve[i] + 1) * this.width / 2;
      this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  makeCurve(equation, minX, maxX) {
    var range = maxX - minX;
    // x and equation(x) in [-1, 1]
    this.curve = new Float32Array(this.width);
    // range goes from -1 to +1 -> 2
    var incX = range / this.width;
    var x = minX;
    for (var i = 0; i < this.width; i++) {
      this.curve[i] = equation(x);
      x += incX;
    }
  }

  setCurve(c) {
    for (var i = 0; i < this.width; i++) {
      var x = Math.round(i * c.length / this.width);
      this.curve[i] = c[x];
    }
  }
}