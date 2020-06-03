const express = require('express');
const fb = require("../firebase");
const db = fb.firestore();
const router = express.Router();

// Routes to the dashboard
router.get("/", (req, res, next) => {
    res.render("dashboard/dashboard", {title: "CMS", dest: "dashboard"});
});

module.exports = router;