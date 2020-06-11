const repo = require("../data/words-repository");

exports.getWords = (req, res) => {
    repo.getWords(req.params.listId)
        .then(result => {
            if (!(typeof result === "string" || result instanceof String)) {
                res.render("wordlists/words", {
                    title: "CMS",
                    dest: "wordlists",
                    words: result.words,
                    images: result.images,
                    listId: req.params.listId,
                    listName: result.listName
                });
            } else {
                res.render("wordlists/words", {
                    title: "CMS",
                    dest: "wordlists",
                    listId: req.params.listId,
                    listName: result
                });
            }
        });
};

exports.updateWords = (req, res) => {
    function insertWords(req, res) {
        repo.insertWords(req.params.listId, req.body.listName)
            .then(() => {
                res.redirect("/cms/word-lists");
            });
    }

    function deleteWords(req, res) {
        repo.deleteWords(req.params.listId)
            .then(() => {
                res.redirect("/cms/word-lists");
            });
    }

    if ("save-wordlist" in req.body && req.body.listName.trim()) {
        insertWords(req, res);
    } else if ("delete-wordlist" in req.body) {
        deleteWords(req, res);
    } else {
        res.redirect("/cms/word-lists");
    }
};