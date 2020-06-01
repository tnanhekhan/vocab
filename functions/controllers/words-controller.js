const fb = require("../firebase");
const db = fb.firestore();

exports.getWords = (req, res) => {
    db.collection("wordlists").doc(req.params.listId).get()
        .then(snapshot => {
            const listName = snapshot.data().name;
            db.collection("wordlists").doc(req.params.listId).listCollections()
                .then(collections => {
                    const collectionId = collections[0].id;
                    db.collection("wordlists").doc(req.params.listId).collection(collectionId).get()
                        .then(snapshot => {
                            return snapshot.docs;
                        })
                        .then(words => {
                            res.render("wordlists/words", {
                                title: "CMS",
                                dest: "wordlists",
                                words: words,
                                listId: req.params.listId,
                                listName: listName
                            });
                        })
                });
        });
}

exports.updateWords = (req, res) => {
    function insertWords(req, res) {
        db.collection("wordlists").doc(req.params.listId)
            .update({name: req.body.listName})
            .then(() => {
                res.redirect("/cms/word-lists");
            });
    }

    function deleteWords(req, res) {
        db.collection("wordlists").doc(req.params.listId)
            .delete()
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
}