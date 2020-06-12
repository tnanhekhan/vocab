fetch('/__/firebase/init.json').then(async response => {
    firebase.initializeApp(await response.json());
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
                .catch(error => {
                    alert("E-mail en/of wachtwoord is incorrect!")
                });
        }
    } else {
        passwordInput.reportValidity();
        usernameInput.reportValidity();
    }
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        firebase.auth().currentUser.getIdToken(true)
            .then(idToken => {
                post(window.location.href, {idToken: idToken});
            });
    } else {
        window.location.href = "/cms";
    }
});

function post(path, params, method = 'post') {
    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
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
