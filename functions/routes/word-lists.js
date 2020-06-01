const express = require('express');
const fb = require("../firebase");
const db = fb.firestore();
const router = express.Router();

const wordListsController = require("../controllers/wordlists-controller")
const wordsController = require("../controllers/words-controller");
const wordController = require("../controllers/word-controller");

// Routes to the all the word lists
router.get('/', (req, res) => {
    wordListsController.getWordLists(req, res)
});

// Routes to the the word list choice screen between manual or load a file
router.get('/add-list', (req, res, next) => {
    wordListsController.getAddWordListModal(req, res);
});

// Routes to the the manual word list screen
router.get('/add-list/manual', (req, res) => {
    wordListsController.getManualAddWordList(req, res);
});

// Redirect logic when creating a word list manually
router.post('/add-list/manual', (req, res) => {
    wordListsController.updateManualAddWordList(req, res);
});

// Routes to the words of a wordlist
router.get('/:listId', (req, res) => {
    wordsController.getWords(req, res)
});

// Redirect logic for updating an existing word list
router.post('/:listId', (req, res) => {
    wordsController.updateWords(req, res);
});

// Routes to the word detail page of a word that is going to be added
router.get("/:listId/add", (req, res) => {
    wordController.getNewWord(req, res)
});

// Redirect logic for inserting a new word
router.post("/:listId/add", (req, res) => {
    wordController.insertNewWord(req, res)
});

// Routes to the word detail page of a word that already exists
router.get("/:listId/:wordId", (req, res, next) => {
    wordController.getWord(req, res)
});

// Redirect logic for updating an existing word
router.post("/:listId/:wordId", (req, res, next) => {
    wordController.updateWord(req, res);
});

module.exports = router;