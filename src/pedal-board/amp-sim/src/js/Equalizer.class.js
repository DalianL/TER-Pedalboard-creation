class Equalizer {
    constructor(ctx, ampElt) {
        this.filters = [];
        this.ampElt = ampElt;
        // Set filters
        // Fred: 80 for the low end. 10000 useless, use shelf instead...
        [60, 170, 350, 1000, 3500, 10000].forEach((freq, i) => {
            var eq = ctx.createBiquadFilter();
            eq.frequency.value = freq;
            eq.type = "peaking";
            eq.gain.value = 0;
            this.filters.push(eq);
            // Connect filters in serie
            //sourceNode.connect(filters[0]);
            for (var i = 0; i < this.filters.length - 1; i++) {
                this.filters[i].connect(this.filters[i + 1]);
            }
        });
    }

    // connect the last filter to the speakers
    //filters[filters.length - 1].connect(ctx.destination);
    changeGain(sliderVal, nbFilter) {
        // sliderVal in [-30, +30]
        var value = parseFloat(sliderVal);
        this.filters[nbFilter].gain.value = value;
        // update output labels
        //var output = document.querySelector("#gain" + nbFilter);
        //output.value = value + " dB";
        // update sliders
        //var numSlider = nbFilter + 1;
        //var slider = document.querySelector("#EQ" + numSlider + "slider");
        //slider.value = value;

        // refresh ampli slider state in the web component GUI
        var sliderWC = this.ampElt["slider" + (nbFilter + 1)];
        // second parameter set to false will not fire an event
        sliderWC.setValue(parseFloat(sliderVal).toFixed(0), false);
    }

    setValues(values) {
        values.forEach((val, index) => {
            this.changeGain(val, index);
        });
    }

    getValues() {
        var values = [];
        this.filters.forEach(function (f, index) {
            values.push(f.gain.value);
        });
        return values;
    }

    get input() {
        return this.filters[0];
    }
    get output() {
        return this.filters[this.filters.length - 1];
    }
    // return {
    //     input: filters[0],
    //     output: filters[filters.length - 1],
    //     setValues: setValues,
    //     getValues: getValues,
    //     changeGain: changeGain
    // };
}