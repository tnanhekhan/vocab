const fb = require("../../firebase");

exports.getUsers = (req) => {
    return new Promise(resolve => {
        fb.auth().listUsers()
            .then(listUsersResult => {
                let filteredUsers = listUsersResult.users.filter(user => {
                    const adminMail = "kF7Mt1q6KaWtI08044rHlwwlHC63";
                    if (user.uid !== adminMail) {
                        return user;
                    }
                });

                resolve(filteredUsers);
            });
    });
}

exports.deleteUser = (uid) => {
    return new Promise((resolve, reject) => {
        fb.auth().deleteUser(uid)
            .then(() => {
                resolve(true);
            })
            .catch(error => {
                reject(error);
            })
    });
}

exports.createUser = (user, pass) => {
    return new Promise((resolve, reject) => {
        fb.auth().createUser({
            email: user,
            password: pass
        })
            .then(userRecord => {
                resolve(userRecord);
            })
            .catch(error => {
                reject(error);
            });
    });
}