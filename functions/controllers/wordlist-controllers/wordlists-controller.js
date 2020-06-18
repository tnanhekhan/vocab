const repo = require("../../data/wordlists-repository");
const xlsx = require('xlsx');

// Routes to the all the word lists
exports.getWordLists = (req, res) => {
    repo.getWordLists()
        .then(wordLists => {
            res.render("wordlists/wordlists", {title: "CMS", dest: "wordlists", wordLists: wordLists});
        })
        .catch(() => {
            res.render("wordlists/wordlists", {title: "CMS", dest: "wordlists"});
        });
};

// Routes to the the word list choice screen between manual or load a file
exports.getAddWordListModal = (req, res) => {
    res.render("wordlists/wordlist-add-choice", {title: "CMS", dest: "wordlists"});
};

// Routes to the the manual word list screen
exports.getManualAddWordList = (req, res) => {
    const now = Date.now();
    repo.getNewManualWordList(now)
        .then(wordList => {
            res.render("wordlists/words", {
                title: "CMS",
                dest: "wordlists",
                words: [],
                listId: wordList.id,
                listName: ""
            });
        });
};

exports.insertUploadedWordList = (req, res) => {
    const now = Date.now();
    const {mimetype, buffer} = req.files[0]
    const workBook = xlsx.read(buffer, {type: "buffer"});
    const worksheetArray = xlsx.utils.sheet_to_json(workBook.Sheets[Object.keys(workBook.Sheets)]);
    const uploadedWordList = worksheetArray.map(field => {
        return {word: field[Object.keys(field)], timestamp: now};
    });

    uploadedWordList.unshift({word: Object.keys(worksheetArray[0])[0], timestamp: uploadedWordList[0].timestamp});
    repo.insertUploadedWordList(now, uploadedWordList)
        .then(id => {
            res.redirect(`/cms/word-lists/${id}`);
        });
};

// Redirect logic when creating a word list manually
exports.updateManualAddWordList = (req, res) => {
    function insertManualWordList(req, res) {
        repo.insertNewManualWordList(req.body.listId, req.body.listName)
            .then(() => {
                res.redirect(`/cms/word-lists/${req.body.listId}`);
            });
    }

    function deleteWordList(req, res) {
        repo.deleteManualWordList(req.body.listId)
            .then(() => {
                res.redirect("/cms/word-lists");
            });
    }

    if ("save-wordlist" in req.body && req.body.listName.trim()) {
        insertManualWordList(req, res);
    } else if ("delete-wordlist" in req.body) {
        deleteWordList(req, res);
    } else {
        res.redirect("/cms/word-lists");
    }
};
