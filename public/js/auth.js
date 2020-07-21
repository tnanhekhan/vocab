const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const registerButton = document.getElementById("register-send-button");
const showLoginButton = document.getElementById("show-login-button");
const loginForm = document.getElementById("login-form");
const loginSubtitle = document.getElementById("login-subtitle");
const path = window.location.pathname

if (path === "/cms/logout") {
    firebase.auth().signOut();
}

if(showLoginButton){
    showLoginButton.onclick = () => {
        showLoginButton.style.display = "none";
        loginSubtitle.style.display = "none";
        loginForm.style.display = "flex";
    }
}

if (loginButton) {
    loginButton.onclick = () => {
        const usernameInput = document.getElementById("username-input");
        const passwordInput = document.getElementById("password-input");

        if (usernameInput.value.length !== 0 && passwordInput.value.length !== 0) {
            if (!usernameInput.checkValidity()) {
                usernameInput.reportValidity();
            } else {
                firebase.auth()
                    .signInWithEmailAndPassword(usernameInput.value, passwordInput.value)
                    .then(success => {
                        firebase.auth().currentUser.getIdToken(true)
                            .then(idToken => {
                                post(window.location.href, {idToken: idToken});
                            });
                    })
                    .catch(error => {
                        alert("E-mail en/of wachtwoord is incorrect!")
                    });
            }
        } else {
            passwordInput.reportValidity();
            usernameInput.reportValidity();
        }
    }
}

if (registerButton) {
    registerButton.onclick = ev => {
        const usernameInput = document.getElementById("username-input");
        const passwordInput = document.getElementById("password-input");
        const passwordRepeatInput = document.getElementById("password-repeat-input");

        const isInputNotEmpty = (usernameInput.value.length !== 0 && passwordInput.value.length !== 0 && passwordRepeatInput.value.length !== 0)
        const isInputValid = (usernameInput.checkValidity() && passwordInput.checkValidity() && passwordRepeatInput.checkValidity());

        if (isInputNotEmpty) {
            if (!isInputValid) {
                usernameInput.reportValidity();
            } else {
                if (passwordInput.value !== passwordRepeatInput.value) {
                    alert("Wachtwoorden zijn niet gelijk!")
                } else {
                    post(window.location.href, {user: usernameInput.value, pass: passwordInput.value});
                }
            }
        } else {
            passwordRepeatInput.reportValidity();
            passwordInput.reportValidity();
            usernameInput.reportValidity();
        }
    }
}

if (logoutButton) {
    logoutButton.onclick = ev => {
        let logoutConfirm = confirm("Wil je uitloggen?");
        if (logoutConfirm === true) {
            firebase.auth().signOut();
        }
    }
}

function post(path, params, method = 'post') {
    const form = document.createElement('form');
    form.method = method;
    form.action = path;

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = params[key];

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}
