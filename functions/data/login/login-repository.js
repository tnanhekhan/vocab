const firebaseService = require("../db/firebase-service");

exports.validateLogin = (idToken) => {
    return new Promise((resolve, reject) => {
        firebaseService.auth.verifyIdToken(idToken)
            .then(verified => {
                const expiresIn = 60 * 60 * 24 * 7 * 1000;

                firebaseService.auth.createSessionCookie(idToken, {expiresIn})
                    .then(cookie => {
                        return resolve(cookie);
                    });
            })
            .catch(error => {
                return reject(error);
            })
    });
}

exports.validateCookie = (cookie) => {
    return firebaseService.auth.verifySessionCookie(cookie);
}