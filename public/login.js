

var div = document.getElementById("modal-login");
var signupdiv = document.getElementById("modal-signup");
var loginBtn = document.getElementById("loginBtn");
var logoutBtn = document.getElementById("logoutBtn");
var presetContainer = document.getElementById("preset-container");
var presetList = document.getElementById("preset-list");
var loadOrDeleteDiv = document.getElementById("loadOrDeletePreset");
let btnLoad = document.getElementById("btnLoad");
let btnDelete = document.getElementById("btnDelete");

let cutoffInput = document.getElementById("cutoff");
let resonanceInput = document.getElementById("resonance");
let osc1WaveTypeInput = document.getElementById("osc1WaveType");
let osc1OctaveInput = document.getElementById("osc1Octave");
let osc1MixInput = document.getElementById("osc1Mix");
let osc1DetuneInput = document.getElementById("osc1Detune");
let osc2WaveTypeInput = document.getElementById("osc2WaveType");
let osc2OctaveInput = document.getElementById("osc2Octave");
let osc2MixInput = document.getElementById("osc2Mix");
let osc2DetuneInput = document.getElementById("osc2Detune");
let attackFInput = document.getElementById("attackF");
let decayFInput = document.getElementById("decayF");
let sustainFInput = document.getElementById("sustainF");
let releaseFInput = document.getElementById("releaseF");

auth.onAuthStateChanged(user =>{

  if(user){
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    presetContainer.style.display = "flex";
    presetContainer.style['flex-direction'] = "column";

    db.collection('synth-presets').where('user-id', '==', user.uid).onSnapshot(snapshot => {
      setupPresets(snapshot);
    });

  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    presetContainer.style.display = "none";
  }

})


function signup(){
  div.style.display = "none";
  signupdiv.style.display = "block";
  window.removeEventListener("keydown", handleKeydown);

  const signupForm = document.getElementById("signup-form");

  signupForm.addEventListener("submit", (e) =>{
      e.preventDefault();

      const email = signupForm['signup-email'].value;
      const password = signupForm['signup-password'].value;

      auth.createUserWithEmailAndPassword(email,password).then(cred =>{
        signupdiv.style.display = "none";
        window.addEventListener("keydown", handleKeydown);
      })
    })
}

function login() {
    
    div.style.display = "block";
    window.removeEventListener("keydown", handleKeydown);

    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", (e) =>{
      e.preventDefault();

      const email = loginForm['login-email'].value;
      const password = loginForm['login-password'].value;

      auth.signInWithEmailAndPassword(email,password).then(cred =>{
        div.style.display = "none";
        window.addEventListener("keydown", handleKeydown);
      })
    })
}

function logout(){
  auth.signOut();
}

function cancel(){
  div.style.display = "none";
  loadOrDeleteDiv.style.display = "none";
  signupdiv.style.display = "none";
  window.addEventListener("keydown", handleKeydown);
}

window.onmousedown = function(event) {
  if (event.target == div || event.target == loadOrDeleteDiv) {
    div.style.display = "none";
    loadOrDeleteDiv.style.display = " none";
    window.addEventListener("keydown", handleKeydown);
  }
}

const setupPresets = (data) => {
  if (data) {
    let html = '';
    data.forEach(doc => {
      var preset = doc.data();
      console.log(doc.id);
      const li = `
        <button class="preset-container2" data-itemid="${doc.id}">
            ${preset['preset-name']}
        </button>
      `;
      html += li;
      
    });
    presetList.innerHTML = html

    const presetContainers = document.querySelectorAll(".preset-container2");
    presetContainers.forEach(preset => preset.addEventListener('click', handlePresetClick, false));
  }
}

const handlePresetClick = (e) => {
  const { target: { dataset: { itemid } } } = e;
  
  loadOrDeleteDiv.style.display = "block";
  
  btnLoad.addEventListener('click', function(){handleLoad(itemid)}, false);
  btnDelete.addEventListener('click', function(){handleDelete(itemid)}, false);
  
}

const handleLoad = (itemid) => {
  db.collection('synth-presets').doc(itemid).get().then((doc) => {
    console.log(doc);
    let data = doc.data();
    cutoff = data.cutoff;
    resonance = data.resonance;
    osc1WaveType = data.osc1WaveType;
    osc1Octave = data.osc1Octave;
    osc1Mix = data.osc1Mix;
    osc1Detune = data.osc1Detune;
    osc2WaveType = data.osc2WaveType;
    osc2Octave = data.osc2Octave;
    osc2Mix = data.osc2Mix;
    osc2Detune = data.osc2Detune;
    attackF = data.attackF;
    decayF = data.decayF;
    sustainF = data.sustainF;
    releaseF = data.releaseF;

    cutoffInput.value = data.cutoff;
    resonanceInput.value = data.resonance;
    osc1WaveTypeInput.value = data.osc1WaveType;
    osc1OctaveInput.selectedIndex = data.osc1Octave;
    osc1MixInput.value = data.osc1Mix;
    osc1DetuneInput.value = data.osc1Detune;
    osc2WaveTypeInput.value = data.osc2WaveType;
    osc2OctaveInput.selectedIndex = data.osc2Octave;
    osc2MixInput.value = data.osc2Mix;
    osc2DetuneInput.value = data.osc2Detune;
    attackFInput.value = data.attackF;
    decayFInput.value = data.decayF;
    sustainFInput.value = data.sustainF;
    releaseFInput.value = data.releaseF;

    alert("preset loaded successfully!");
    loadOrDeleteDiv.style.display = "none";
  });
  btnLoad.removeEventListener('click', handleLoad);
}

const handleDelete = (itemid) => {

  if (confirm("Are you sure?") == true) {
    db.collection('synth-presets').doc(itemid).delete().then(() =>{
      console.log("preset deleted.");
      loadOrDeleteDiv.style.display = "none";
    }).catch((error) => {
      console.error("Error deleting preset: ", error);
    })
  } else {
    loadOrDeleteDiv.style.display = "none";
  }
  
  btnDelete.removeEventListener('click', handleDelete);
}


