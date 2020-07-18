const repo = require("../../data/login/login-repository");

exports.getLogin = (req, res) => {
    res.render("login/login", {title: "CMS"});
}

exports.validateLogin = (req, res) => {
    repo.validateLogin(req.body.idToken)
        .then(cookie => {
            res.cookie('session', cookie);
            res.redirect("/cms/dashboard");
        })
        .catch(onError => {
            res.redirect("/cms");
        })
}

exports.getRegister = (req, res) => {
    res.render("login/register", {title: "CMS"});
}

exports.verifyCookie = (req, res, next) => {
    if (req.cookies.session) {
        repo.validateCookie(req.cookies.session)
            .then(() => {
                next();
            })
            .catch(() => {
                res.redirect("/cms");
            })
    } else {
        res.redirect("/cms");
    }
}

exports.logout = (req, res) => {
    res.clearCookie("session");
    res.render("login/logout", {title: "CMS"});
}