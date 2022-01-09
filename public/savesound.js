var presetDiv = document.getElementById("savePresetForm");

function saveSound(){
    const user = auth.currentUser;
    presetDiv.style.display = "block";
    window.removeEventListener("keydown", handleKeydown);

    const presetForm = document.getElementById("preset-form");

    presetForm.addEventListener("submit", (e) =>{

      e.preventDefault();
      const presetName = presetForm['preset-name'].value;

      if(user){

        //let numberOfPresets = db.collection('synth-presets').where('user-id', '==', user.uid).length();

        db.collection('synth-presets').add({
            'user-id': user.uid,
            'preset-name': presetName,
            cutoff: cutoff,
            resonance: resonance,
            osc1WaveType: osc1WaveType,
            osc1Mix: osc1Mix,
            osc1Octave: osc1Octave,
            osc1Detune: osc1Detune,
            osc2WaveType: osc2WaveType,
            osc2Octave: osc2Octave,
            osc2Mix: osc2Mix,
            osc2Detune: osc2Detune,
            attackF: attackF,
            decayF: decayF,
            sustainF: sustainF,
            releaseF: releaseF
        })

        alert('preset saved successfully!');
        presetDiv.style.display = "none";

    } else {
        alert('You have to be logged in to save a preset!')
    }


    })

    
    
    
}
