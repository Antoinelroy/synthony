

var div = document.getElementById("modal-login");
var loginBtn = document.getElementById("loginBtn");
var logoutBtn = document.getElementById("logoutBtn");
var presetContainer = document.getElementById("preset-container");
var presetList = document.getElementById("preset-list");

auth.onAuthStateChanged(user =>{

  if(user){
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    presetContainer.style.display = "flex";
    presetContainer.style['flex-direction'] = "column";

    db.collection('synth-presets').get().then(snapshot => {
      setupPresets(snapshot);
    });

  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    presetContainer.style.display = "none";
  }

})




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
  window.addEventListener("keydown", handleKeydown);
}

window.onmousedown = function(event) {
  if (event.target == div) {
    div.style.display = "none";
    window.addEventListener("keydown", handleKeydown);
  }
}

const setupPresets = (data) => {
  console.log(data.docs[0].id);
  if (data) {
    let html = '';
    data.forEach(doc => {
      var preset = doc.data();
      console.log(doc.id);
      var presetId = doc.id;
      const li = `
        <li class="preset-container2">
          <div class="preset">
            <p>${preset['preset-name']}<p>
            <button class="btnDelete" onclick="deletePreset(${presetId})"></button> 
          </div>
        </li>
      `;
      html += li;
    });
    presetList.innerHTML = html
  }
}

const deletePreset = (preset) => {
  //  console.log(preset);
}