const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login/login-controller')

// Routes to the dashboard
router.get("/", (req, res, next) => {
    loginController.getLogin(req, res);
});

// Routes to the dashboard
router.post("/", (req, res, next) => {
    loginController.validateLogin(req, res);
});

router.all("/*", (req, res, next) => {
    loginController.verifyCookie(req, res, next);
});

router.get("/dashboard", (req, res) => {
    res.render("dashboard/dashboard", {title: "CMS", dest: "dashboard"});
});

router.get("/register", (req, res) => {
    loginController.getRegister(req, res);
});

router.post("/register", (req, res) => {
    loginController.validateLogin(req, res);
});

router.get("/logout", (req, res) => {
    loginController.logout(req, res);
})

module.exports = router;