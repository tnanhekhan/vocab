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

router.get("/dashboard", (req, res) => {
    res.render("dashboard/dashboard", {title: "CMS", dest: "dashboard"});
})

module.exports = router;