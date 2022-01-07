let keys = new Array(256);
let voices = [];
let audioContext = null;
let isMobile = null;
let volume = 0.5;

let cutoff = 255;
let resonance = 2;
let osc1WaveType = 'sine';
let osc1Octave = 0;
let osc1Mix = 0.25;
let osc1Detune = 0;

let osc2WaveType = 'sine';
let osc2Octave = 0;
let osc2Mix = 0.25;
let osc2Detune = 0;

let attackF = 0;
let decayF = 50;
let sustainF = 50;
let releaseF = 5;

let effectChain = null;
let waveshaper = null;
let volNode = null;
let revNode = null;
let revGain = null;
let revBypassGain = null;
let compressor = null;

mapKeys = () => {
    keys[90] = 48; // C3
    keys[83] = 49;
    keys[88] = 50;
    keys[68] = 51;
    keys[67] = 52;
    keys[86] = 53; //F3
    keys[71] = 54;
    keys[66] = 55;
    keys[72] = 56;
    keys[78] = 57; //A3
    keys[74] = 58;
    keys[77] = 59;
    keys[188] = 60; //C4
    keys[76] = 61;
    keys[190] = 62;
    keys[186] = 63;
    keys[191] = 64;
    keys[81] = 65; //F4
    keys[50] = 66;
    keys[87] = 67;
    keys[51] = 68;
    keys[69] = 69; //A4
    keys[52] = 70;
    keys[82] = 71;
    keys[84] = 72; //C5
    keys[54] = 73;
    keys[89] = 74;
    keys[55] = 75;
    keys[85] = 76;
    keys[73] = 77; //F5
    keys[57] = 78;
    keys[79] = 79;
    keys[48] = 80;
    keys[80] = 81; //A5
    keys[189] = 82;
    keys[219] = 83;
}

setup = () => {
    mapKeys();
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyUp);
    audioContext = new AudioContext();

    isMobile = (navigator.userAgent.indexOf("Android")!=-1)||(navigator.userAgent.indexOf("iPad")!=-1)||(navigator.userAgent.indexOf("iPhone")!=-1);

    effectChain = audioContext.createGain();

    /*volNode = audioContext.createGain();
    volNode.gain.value = volume;
    compressor = audioContext.createDynamicsCompressor();
    
    volNode.connect( compressor );
    compressor.connect(	effectChain );*/
    //handleVolumeChange( {currentTarget:{value:volume}} );

    let keysToClick = document.getElementsByTagName("li");

    for(let i = 0; i < keysToClick.length; i++){
        keysToClick[i].onpointerdown = handlePointerDown;
        keysToClick[i].onpointerup = handlePointerUp;
        keysToClick[i].onpointermove = handlePointerMove;
    }
}

let pointers = [];

handlePointerDown = (event) => {
    let note = event.target.id.substring(1)
    if(note){
        this.noteOn(note);
        pointers[event.pointerId] = note;
    }
}

handlePointerUp = (event) => {
    let note = event.target.id.substring(1);
    if(note){
        this.noteOff(note);
        pointers[event.pointerId] = null;
    }
}

handlePointerMove = (event) => {
    let note = event.target.id.substring(1)
    //console.log(pointers[event.pointerId]);
    if(note && pointers[event.pointerId] && pointers[event.pointerId] != note){
        if(pointers[event.pointerId]){
            noteOff(pointers[event.pointerId])
        }
        this.noteOn(note);
        pointers[event.pointerId] = note;
    }
}

handleKeydown = (event) => {
    let note = keys[event.keyCode];
    if(note){
        this.noteOn(note);
    }
}

handleKeyUp = (event) => {
    let note = keys[event.keyCode];
    if(note){
        this.noteOff(note);
    }
}


noteOn = (note) => {
    //console.log(voices[note]);
    //console.log(note);
    if(voices[note] == null){
        voices[note] = new Voice(note);
        let e = document.getElementById("k" + note);
        if(e){
            e.classList.add("pressed");
        }
    }
}

noteOff = (note) => {
    if(voices[note] != null){
        voices[note].noteOff();
        voices[note] = null;
        let e = document.getElementById("k" + note);
        if(e){
            e.classList.remove("pressed");
        }
    }
}

handleOsc1MixChange = (value) => {
    osc1Mix = value;

    for (var i=0; i<255; i++) {
        if (voices[i] != null) {
            voices[i].updateOsc1Mix(value);
        }
    }
}

handleOsc2MixChange = (value) => {
    osc2Mix = value;

    for (var i=0; i<255; i++) {
        if (voices[i] != null) {
            voices[i].updateOsc2Mix(value);
        }
    }
}

handleOsc1DetuneChange = (value) => {
    osc1Detune = value;

    for (var i=0; i<255; i++) {
        if (voices[i] != null) {
            voices[i].updateOsc1Freq(value);
        }
    }
}

handleOsc2DetuneChange = (value) => {
    osc2Detune = value;

    for (var i=0; i<255; i++) {
        if (voices[i] != null) {
            voices[i].updateOsc2Freq(value);
        }
    }
}

handleOsc1WaveTypeChange = (value) => {
    osc1WaveType = value;

    for (var i=0; i<255; i++) {
        if (voices[i] != null) {
            voices[i].updateOsc1WaveType(value);
        }
    }
}

handleOsc2WaveTypeChange = (value) => {
    osc2WaveType = value;

    for (var i=0; i<255; i++) {
        if (voices[i] != null) {
            voices[i].updateOsc2WaveType(value);
        }
    }
}

handleOsc1OctaveChange = (value) => {
    osc1Octave = value;

    for (var i=0; i<255; i++) {
        if (voices[i] != null) {
            voices[i].updateOsc1Freq();
        }
    }
}

handleOsc2OctaveChange = (value) => {
    osc2Octave = value;

    for (var i=0; i<255; i++) {
        if (voices[i] != null) {
            voices[i].updateOsc2Freq();
        }
    }
}

handleCutoffChange = (value) => {
    cutoff = 50 * Math.pow(22050 / 50, 1 / 22050) ** value;

    for (var i=0; i<255; i++) {
        if (voices[i] != null) {
            voices[i].updateCutoff(cutoff);
        }
    }
    
}

handleResonanceChange = (value) => {
    resonance = value;

    for (var i=0; i<255; i++) {
        if (voices[i] != null) {
            voices[i].updateResonance(resonance);
        }
    }
}

handleFilterAttackChange = (value) => {
    attackF = value;
}

handleFilterDecayChange = (value) => {
    decayF = value;
}

handleFilterSustainChange = (value) => {
    sustainF = value;
}

handleFilterReleaseChange = (value) => {
    releaseF = value;
}

handleVolumeChange = (value) => {
	volume = value/100;
}



const frequencyFromNote = (note) => {
    return 440 * Math.pow(2,(note-69)/12);
}

function Voice(note) {
    this.freq = parseFloat(frequencyFromNote(note));

    this.osc1 = audioContext.createOscillator();
    this.updateOsc1Freq();
    this.osc1.type = osc1WaveType;

    this.osc1Gain = audioContext.createGain();
    this.osc1Gain.gain.value = osc1Mix;
    //this.osc1Gain.connect(audioContext.destination);

    this.osc2 = audioContext.createOscillator();
    this.updateOsc2Freq();
    this.osc2.type = osc2WaveType;

    this.osc2Gain = audioContext.createGain();
    this.osc2Gain.gain.value = osc2Mix;
    //this.osc2Gain.connect(audioContext.destination);
    
    //console.log("cutoff: " + cutoff);
    
    this.osc1.connect(this.osc1Gain);
    this.osc2.connect(this.osc2Gain);

    this.filter1 = audioContext.createBiquadFilter();
    this.filter1.type = "lowpass";
    this.filter1.Q.value = resonance;
    this.filter1.frequency.value = cutoff;

    this.filter2 = audioContext.createBiquadFilter();
	this.filter2.type = "lowpass";
	this.filter2.Q.value = resonance;
	this.filter2.frequency.value = cutoff;
    
    
    this.osc1Gain.connect(this.filter1);
    this.osc2Gain.connect(this.filter1);
    this.filter1.connect(this.filter2);

    this.envelope = audioContext.createGain();
	this.filter2.connect(this.envelope);
	this.envelope.connect(effectChain);

    effectChain.gain.value = volume;
    effectChain.connect(audioContext.destination);

	// set up the volume and filter envelopes
	var now = audioContext.currentTime;
	var envAttackEnd = now + (attackF/20.0);

	this.envelope.gain.value = 0.0;
	this.envelope.gain.setValueAtTime( 0.0, now );
	this.envelope.gain.linearRampToValueAtTime( 1.0, envAttackEnd );
	this.envelope.gain.setTargetAtTime( (sustainF/100.0), envAttackEnd, (decayF/100.0)+0.001 );


    /*if(isFinite(this.freq)){
        this.osc1.frequency.value = this.freq;
        this.osc2.frequency.value = this.freq;
    }*/
    
    this.osc1.start(0);
    this.osc2.start(0);

}

/*Voice.prototype.updateVolume = function(value){
	this.osc1Gain.gain.value = value;
}*/

Voice.prototype.updateCutoff = function(value){
    let cutoff = parseFloat(value);

    if(isFinite(value)){
        this.filter1.frequency.value = cutoff;
        this.filter2.frequency.value = cutoff;
    }
    
}

Voice.prototype.updateResonance = function(value){
    this.filter1.Q.value = value;
    this.filter2.Q.value = value;
}

Voice.prototype.updateOsc1WaveType = function(value){
    this.osc1.type = value;
}

Voice.prototype.updateOsc2WaveType = function(value){
    this.osc2.type = value;
}

Voice.prototype.updateOsc1Mix = function(value){
    this.osc1Gain.gain.value = value;
}

Voice.prototype.updateOsc2Mix = function(value){
    this.osc2Gain.gain.value = value;
}

Voice.prototype.updateOsc1Freq = function(value){
    this.osc1.frequency.value = this.freq * Math.pow(2,osc1Octave-2);
	this.osc1.detune.value = osc1Detune;
}

Voice.prototype.updateOsc2Freq = function(value){
    this.osc2.frequency.value = this.freq * Math.pow(2,osc2Octave-2);
	this.osc2.detune.value = osc2Detune;
}

Voice.prototype.noteOff = function() {

    var now =  audioContext.currentTime;
	var release = now + (releaseF/10.0);

    //console.log("noteoff: now: " + now + " val: " + this.filter1.frequency.value + " fR: " + releaseF/100 );
	this.envelope.gain.cancelScheduledValues(now);
	this.envelope.gain.setValueAtTime( this.envelope.gain.value, now );  // this is necessary because of the linear ramp
	this.envelope.gain.setTargetAtTime(0.0, now, (releaseF/100));

	this.osc1.stop( release );
	this.osc2.stop( release );
}


window.onload=setup;
