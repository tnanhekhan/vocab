const firebaseService = require("../db/firebase-service");

exports.validateLogin = (idToken) => {
        return firebaseService.auth.verifyIdToken(idToken);
}