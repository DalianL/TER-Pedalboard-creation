var pedalboard ={
  elem:undefined,
  pedals:[],
  add:function(p) {
    this.pedals.push(p);
    p.pedalboard = this;
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
        var iPos = p.getInputPos();
        var oPos = p.getOutputPos();
        var distInput = distance(x, y, iPos.x, iPos.y);
        var distOutput = distance(x, y, oPos.x, oPos.y);
        //console.log('x = ' + oPos.x + ' y = ' + x);
        //console.log(distOutput);
        //var distOutput = distance(x, y, oPos.x, oPos.y);

        if(distInput < 20) {
          if(!p.inputHighlighted)
             p.highLightInput(true);
        } else {
          if(p.inputHighlighted)
             p.highLightInput(false);
        }
        
        if(distOutput < 20) {
          if(!p.outputHighlighted)
             p.highLightOutput(true);
        } else {
          if(p.outputHighlighted)
             p.highLightOutput(false);
        }

      });
  }
};