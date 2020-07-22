const repo = require("../../data/login/login-repository");

exports.getLogin = (req, res) => {
    if (req.cookies["__session"]) {
        repo.validateCookie(req.cookies["__session"])
            .then(() => {
                res.redirect("/cms/dashboard");
            })
            .catch(() => {
                res.render("login/login", {title: "CMS"});
            })
    } else {
        res.render("login/login", {title: "CMS"});
    }
}

exports.validateLogin = (req, res) => {
    repo.validateLogin(req.body.idToken)
        .then(cookie => {
            res.setHeader('Cache-Control', 'private');
            res.cookie('__session', cookie);
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
    if (req.cookies["__session"]) {
        repo.validateCookie(req.cookies["__session"])
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
    res.clearCookie("__session");
    res.render("login/logout", {title: "CMS"});
}