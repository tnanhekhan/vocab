const firebaseService = require("../db/firebase-service");

exports.validateLogin = (idToken) => {
    return new Promise((resolve, reject) => {
        return firebaseService.auth.verifyIdToken(idToken)
            .then(success => {
                return resolve(success);
            })
            .catch(error => {
                return reject(error);
            });
    })
}