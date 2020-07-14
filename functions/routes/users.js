const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users/users-controller')


router.get("/", (req, res) => {
    usersController.getUsers(req, res)
});

router.post("/", (req, res) => {
    usersController.deleteUser(req, res);
});

router.get("/add", (req ,res) => {
    usersController.getAddUser(req, res);
});

router.post("/add", (req ,res) => {
    usersController.createUser(req, res);
});

module.exports = router;