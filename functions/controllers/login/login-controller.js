const repo = require("../../data/login/login-repository");

exports.getLogin = (req, res) => {
    res.render("login/login", {title: "CMS"});
}

exports.validateLogin = (req, res) => {
    repo.validateLogin(req.body.idToken)
        .then(onSuccess => {
            res.redirect("/cms/dashboard");
        })
        .catch(onError => {
            res.redirect("/cms");
        })
}

exports.getRegister = (req, res) => {
    res.render("login/register", {title: "CMS"});
}