const repo = require("../../data/users/users-repository");

exports.getUsers = (req, res) => {
    repo.getUsers()
        .then(users => {
            res.render("users/users", {title: "CMS", dest: "users", users: users});
        });
}

exports.deleteUser = (req, res) => {
    repo.deleteUser(req.body.uid)
        .then(() => {
            res.redirect("/cms/users");
        })
        .catch(() => {
            res.redirect("/cms/users");
        });
}

exports.getAddUser = (req, res) => {
    res.render("users/add-user", {title: "CMS", dest: "users"});
}

exports.createUser = (req, res) => {
    repo.createUser(req.body.user, req.body.pass)
        .then(user => {
            res.redirect("/cms/users");
        })
        .catch(error => {
            res.redirect("/cms/users");
        })
}