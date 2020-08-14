const express = require('express');
const router = express.Router();

router.get("/en-privacy-policy", (req, res) => {
    res.render("legal/en-privacy-policy", {title: "Privacy Policy", dest: "null"})
});

router.get("/nl-privacy-policy", (req, res) => {
    res.render("legal/nl-privacy-policy", {title: "Privacybeleid", dest: "null"})
});

router.get("/terms-and-conditions", (req, res) => {
    res.render("legal/terms-and-conditions", {title: "Terms and Conditions", dest: "null"})

});

module.exports = router;
