const express = require('express');
const fb = require("../firebase");
const db = fb.firestore();
const router = express.Router();

const classListsController = require('../controllers/classlist-constrollers/classlist-controller');
const classController = require('../controllers/classlist-constrollers/class-controller');

router.get('/', (req, res) => {
    classListsController.getClassLists(req, res);
});

//add a class screen
router.get('/add-class', (req, res) => {
    classListsController.getAddStudentListModal(req, res);
});

//Go to screen of a specific class
router.get('/:classId', (req, res) => {
    classController.getClass(req, res);
});

//Go to screen of specific student in a class
router.get("/:classId/:studentId", (req, res) => {
    classController.getStudent(req, res)
});

module.exports = router;