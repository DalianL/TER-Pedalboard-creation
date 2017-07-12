// Booster, useful to add a "Boost channel"
class Boost {
    constructor(context) {
        this.context = context;
        this.activated = false;
        this.input = context.createGain();
        this.inputGain = context.createGain();
        this.byPass = context.createGain();
        this.filter = context.createBiquadFilter();
        this.shaper = context.createWaveShaper();
        this.outputGain = context.createGain();
        this.output = context.createGain();
        this.inputGain.gain.value = 0;
        this.byPass.gain.value = 1;
        this.filter.frequency.value = 3317;
        this.shaper.curve = this.makeDistortionCurve(640);
        this.outputGain.gain.value = 2;
        // build graph
        this.input.connect(this.inputGain);
        this.inputGain.connect(this.shaper);
        this.shaper.connect(this.filter);
        this.filter.connect(this.outputGain);
        this.outputGain.connect(this.output);
        // bypass route
        this.input.connect(this.byPass);
        this.byPass.connect(this.output);
    }

    isActivated() {
        return this.activated;
    }

    onOff(wantedState) {
        if (wantedState === undefined) {
            // do not boost
            if (this.activated) this.toggle();
            return;
        }
        if (wantedState !== this.activated) {
            this.toggle();
        }
    }

    toggle() {
        if (!this.activated) {
            this.byPass.gain.value = 0;
            this.inputGain.gain.value = 1;
        } else {
            this.byPass.gain.value = 1;
            this.inputGain.gain.value = 0;
        }
        this.activated = !this.activated;
    }

    setOversampling(value) {
        this.shaper.oversample = value;
        console.log("boost set oversampling to " + value);
    }

    makeDistortionCurve(k) {
        var n_samples = 44100; //65536; //22050;     //44100
        var curve = new Float32Array(n_samples);
        var deg = Math.PI / 180;
        for (var i = 0; i < n_samples; i += 1) {
            var x = i * 2 / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }
}