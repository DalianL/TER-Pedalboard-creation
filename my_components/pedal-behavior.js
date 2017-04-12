/**
  A behavior defining the functions and properties every pedal must have
**/


  PedalBehavior = {

      properties: {
        soundNodeIn : {
          type:Object,
          value: function() {return Pizzicato.context.createGain();  }
        },
        soundNodeOut : {
          type:Object,
          value: function () {return Pizzicato.context.createGain(); }
        }
        ,
        isOn: {
          type:Boolean,
          value: function() { return false; }
        }

      },

      /** The abstract functions every pedal must override **/
      createAllInternNodes: function () {},
      setKnobsListeners: function() {},
      setRolesToKnobs:function () {},
      getDefaultButtonsValues: function() {},
      bypass: function() {},
      reactivate: function() {},
      connectInternNodes:function () {},

      /**Some function common to every pedal **/

      /** Link the pedal to a src audioNode and a destination audioNode
        It is the equivalent of connectIn(src); connectOut(destination);
        @param src : the source audioNode
        @param destination : the destination audioNode
      **/
      connect:function(src,destination) {
        this.connectIn(src);
        this.connectOut(destination);
      },

      /**
        Set a listener to the switch to bypass/reactivate the pedal when it is clicked
      **/
      setSwitchListener : function() {
        var t = this;
        var swi = this.getElementsByTagName("webaudio-switch")[0];
        swi.addEventListener('change', function (e) {
          if (t.isOn)
            t.bypass();
          else
            t.reactivate();
          t.isOn = !t.isOn;

        });
      }
      ,
      /**
      *  Set the pedal to an active or bypassed state
      *  @param active : a Boolean indicating whether the pedal sould be active or not
      *  if active if undefined, it is considered false
      **/
      setPedalActive : function (active) {
        if (active == undefined || active == false) {
          this.isOn = false;
          this.bypass();
          this.getElementsByTagName("webaudio-switch")[0].value = 0;
        }
        else if (active) {
          this.isOn = true;
          this.reactivate();
          this.getElementsByTagName("webaudio-switch")[0].value = 1;
        }
      }
      ,
      /**
      * Set values to the knobs
      * @param options : the values that must be set, if it undefined the default values are used
      **/
      setValuesToKnobs: function(options) {
        var defaultValues = options ==undefined ? this.getDefaultButtonsValues() : options;
        for (var key in defaultValues) {
          this.querySelector("[data-role='"+key+"']").value = defaultValues[key];
        }

      },
      /**
      * Retrieves the current knob values of the pedal
      * @return an object containing a list of label : value , the label are the roles of the knobs
      * defined in setRolesToKnobs
      **/
      getCurrentKnobsValues: function() {
        var values = {};
        var knobs = this.getElementsByTagName("webaudio-knob");
        var i , l = knobs.length;
        for (i=0;i< l;i++) {
          if (knobs[i].dataset.role)
            values[knobs[i].dataset.role] = knobs[i].value;
        }
        return values;
      },
      /**
      * Reset all the knobs values, giving them the NaN value
      **/
      resetKnobs: function () {
        var knobs = this.getElementsByTagName("webaudio-knob");
        for (var i = 0;i< knobs.length;i++)
          knobs[i].value = NaN;
      },
      /**
      * Disconnect the out node of the pedal
      **/
      disconnectOut: function() {
        this.soundNodeOut.disconnect();
      },
      /**
      * Connect the out node of the pedal
      * Updates the new destination of the pedal
      **/
      connectOut: function(audioNode) {
        this.destination = audioNode;
        this.soundNodeOut.connect(audioNode);
      },
      /**
      * Disconnect the in node of the pedal
      **/
      disconnectIn: function() {
        this.src.disconnect(this.soundNodeIn);
      },
      /**
      * Cconnect the in node of the pedal
      * Updates the new source of the pedal
      **/
      connectIn: function(audioNode) {
        audioNode.connect(this.soundNodeIn);
        this.src = audioNode;
      },
      getNodeIn: function () {
        return this.soundNodeIn;
      },
      getNodeOut: function() {
        return this.soundNodeOut;
      }

    };


window.MyBehaviors = window.MyBehaviors || {};
MyBehaviors.PedalBehavior = PedalBehavior;
