firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        if (window.location.pathname !== "/cms") {
            window.location.href = "/cms";
        }
    }
});

document.getElementById("login-button").onclick = ev => {
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
