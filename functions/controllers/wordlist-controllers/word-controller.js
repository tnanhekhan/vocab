const repo = require("../../data/word-repository");
const fb = require("../../firebase");
const bucket = fb.storage().bucket();

exports.getNewWord = (req, res) => {
    res.render("wordlists/word-detail", {
        title: "CMS",
        dest: "wordlists",
        word: "",
        listId: req.params.listId,
        hasImage: false
    });
}

exports.insertNewWord = (req, res) => {
    if ("save-word" in req.body && req.body.word.trim()) {
        repo.insertNewWord(req.params.listId, req.body.word)
            .then(() => {
                res.redirect(`/cms/word-lists/${req.params.listId}`);
            });
    } else {
        res.redirect(`/cms/word-lists/${req.params.listId}`);
    }
};

exports.getWord = (req, res) => {
    repo.getWord(req.params.listId, req.params.wordId)
        .then(result => {
            res.render("wordlists/word-detail", {
                title: "CMS",
                dest: "wordlists",
                word: result.word,
                listId: req.params.listId,
                wordId: req.params.wordId,
                hasImage: result.hasImage,
                image: result.image
            });
        })
        .catch(result => {
            res.render("wordlists/word-detail", {
                title: "CMS",
                dest: "wordlists",
                word: result.word,
                listId: req.params.listId,
                wordId: req.params.wordId,
                hasImage: false
            });
        });
}

exports.updateWord = (req, res) => {
    if ("cancel-word" in req.body) {
        res.redirect(`/cms/word-lists/${req.params.listId}`);
    }

    function insertWord(req, res) {
        repo.updateWord(req.params.listId, req.params.wordId, req.body.word)
            .then(() => {
                res.redirect(`/cms/word-lists/${req.params.listId}`);
            });
    }

    function deleteWord(req, res) {
        repo.deleteWord(req.params.listId, req.params.wordId)
            .then(() => {
                res.redirect(`/cms/word-lists/${req.params.listId}`);
            });
    }

    if (!("save-word" in req.body)) {
        if (!("delete-word" in req.body)) {
            const {mimetype, buffer} = req.files[0]
            repo.saveImage(req.params.wordId, buffer, mimetype)
                .then(() => {
                    console.log("File uploaded");
                });
        }
    }

    if ("save-word" in req.body && req.body.word.trim()) {
        insertWord(req, res);
    } else if ("delete-word" in req.body) {
        deleteWord(req, res);
    } else {
        res.redirect(`/cms/word-lists/${req.params.listId}`);
    }
}