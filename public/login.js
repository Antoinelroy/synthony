var div = document.getElementById("firebaseui-auth-container");
var ui = new firebaseui.auth.AuthUI(firebase.auth());

function login() {
    
    div.style.display = "block";
    window.removeEventListener("keydown", handleKeydown);

    ui.start('#firebaseui-auth-container', {
        signInOptions: [
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
          }
        ],
        signInSuccessUrl: '/public',
        // Other config options...
    });
}

window.onclick = function(event) {
  if (event.target == div) {
    div.style.display = "none";
    ui.reset();
    window.addEventListener("keydown", handleKeydown);
  }
}