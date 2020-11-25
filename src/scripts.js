let sasJs;

function login() {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  sasJs.logIn(username, password).then((response) => {
    if (response.isLoggedIn === false) {
      alert("Invalid Username/Password");
    } else {
      const loginForm = document.querySelector("#login-form");
      const loginButton = document.querySelector("#login");
      loginForm.style.display = "none";
      loginButton.style.display = "none";

      const uploadForm = document.querySelector("#upload-form");
      const uploadButton = document.querySelector("#upload");
      uploadForm.style.display = "flex";
      uploadButton.style.display = "inline-block";
    }
  });
}

function upload() {
  alert("Uploading...");
}
