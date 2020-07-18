const express = require('express');
const router = express.Router();

const classListsController = require('../controllers/classlist-constrollers/classlist-controller');
const classController = require('../controllers/classlist-constrollers/class-controller');

//classlist screen
router.get('/', (req, res) => {
    classListsController.getClassLists(req, res);
});

//add a class screen
router.get('/add-class', (req, res) => {
    classListsController.getAddStudentListModal(req, res);
});

//add a class screen
router.post('/add-class', (req, res) => {
    classListsController.insertUploadedClasslist(req,res);
});

//Go to screen of a specific class
router.get('/:classId', (req, res) => {
    classController.getClass(req, res);
});

//screen to add student manually or by uploading
router.get("/:classId/add", (req, res) => {
    classController.newStudentScreen(req, res);
});

//
router.get('/:classId/add-student/manual', (req, res) => {
    classController.addStudentManually(req,res);
});

router.post('/:classId/add-student/manual', (req, res) => {
    classController.insertUploadedStudent(req,res);
});

router.get('/:classId/lijst-toewijzen', (req,res) => {
   classController.lijstKiezen(req,res);
});

router.get('/:classId/lijst-toewijzen/:listId', (req,res) => {
    classController.lijstToewijzen(req,res);
});

router.post('/:classId/lijst-toewijzen/:listId', (req,res) => {
    classController.lijstUploaden(req,res);
});

//Go to screen of specific student in a class
router.get("/:classId/:studentId", (req, res) => {
    classController.getStudent(req, res)
});


module.exports = router;