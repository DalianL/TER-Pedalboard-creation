// ------- CONVOLVER, used for both reverb and cabinet simulation -------------------
class Convolver {
    constructor(context, impulses, menuElt) {
        this.context = context;
        this.IRs = impulses;
        this.menuIRs;
        this.decodedImpulse;
        // create source and gain node
        this.input = this.context.createGain();
        this.output = this.context.createGain();
        this.currentImpulse = this.IRs[0];
        this.defaultImpulseURL = this.IRs[0].url;
        this.convolverNode = this.context.createConvolver();
        this.convolverNode.buffer = this.decodedImpulse;
        this.convolverGain = this.context.createGain();
        this.convolverGain.gain.value = 0;
        this.directGain = this.context.createGain();
        this.directGain.gain.value = 1;
        this.buildIRsMenu(menuElt);
        this.buildAudioGraphConvolver();
        this.setGain(0.2);
        this.loadImpulseByUrl(this.defaultImpulseURL);
    }


    loadImpulseByUrl(url) {
        // Load default impulse
        const samples = Promise.all([Utils.loadSample(this.context, url)]).then(this.setImpulse.bind(this));
    }

    loadImpulseByName(name) {
        var url = "none";
        if (name === undefined) {
            name = this.IRs[0].name;
            console.log("loadImpulseByName: name undefined, loading default impulse " + name);
        }
        // get url corresponding to name
        for (var i = 0; i < this.IRs.length; i++) {
            if (this.IRs[i].name === name) {
                url = this.IRs[i].url;
                this.currentImpulse = this.IRs[i];
                this.menuIRs.value = i;
                break;
            }
        }
        if (url === "none") {
            console.log("ERROR loading reverb impulse name = " + name);
        } else {
            console.log("loadImpulseByName loading " + this.currentImpulse.name);
            this.loadImpulseByUrl(url);
        }
    }

    loadImpulseFromMenu() {
        var url = this.IRs[this.menuIRs.value].url;
        this.currentImpulse = this.IRs[this.menuIRs.value];
        console.log("loadImpulseFromMenu loading " + this.currentImpulse.name);
        this.loadImpulseByUrl(url);
    }

    setImpulse(param) {
        // we get here only when the impulse is loaded and decoded
        console.log("impulse loaded and decoded");
        this.convolverNode.buffer = param[0];
        console.log("convolverNode.buffer set with the new impulse (loaded and decoded");
    }

    buildAudioGraphConvolver() {
        // direct/dry route source -> directGain -> destination
        this.input.connect(this.directGain);
        this.directGain.connect(this.output);
        // wet route with convolver: source -> convolver 
        // -> convolverGain -> destination
        this.input.connect(this.convolverNode);
        this.convolverNode.connect(this.convolverGain);
        this.convolverGain.connect(this.output);
    }

    setGain(value) {
        this.directGain.gain.value = Math.cos(value * Math.PI / 2);
        this.convolverGain.gain.value = Math.cos((1 - value) * Math.PI / 2);
    }

    getGain() {
        return 2 * Math.acos(this.directGain.gain.value) / Math.PI;
    }

    getName() {
        return this.currentImpulse.name;
    }

    buildIRsMenu(menuElt) {
        this.menuIRs = menuElt;
        // this.IRs.forEach((impulse, index) => {
        //     var option = document.createElement("option");
        //     option.value = index;
        //     option.text = impulse.name;
        //     this.menuIRs.appendChild(option);
        // });
        this.menuIRs.addEventListener('input', () => {
            this.loadImpulseFromMenu()
        })
    }
    //--------------------------------------
    // API : exposed methods and properties
    // -------------------------------------
    // return {
    //     input: input,
    //     output: output,
    //     setGain: setGain,
    //     getGain: getGain,
    //     getName: getName,
    //     loadImpulseByName: loadImpulseByName
    // };
}