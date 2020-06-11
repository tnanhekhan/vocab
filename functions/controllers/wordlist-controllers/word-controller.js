const fb = require("../../firebase");
const bucket = fb.storage().bucket();
const db = fb.firestore();

exports.getNewWord = (req, res) => {
    res.render("wordlists/word-detail", {
        title: "CMS",
        dest: "wordlists",
        word: "",
        listId: req.params.listId,
    });
}

exports.insertNewWord = (req, res) => {
    if ("save-word" in req.body && req.body.word.trim()) {
        db.collection("wordlists").doc(req.params.listId).listCollections()
            .then(collections => {
                const collectionId = collections[0].id;
                db.collection("wordlists").doc(req.params.listId).collection(collectionId)
                    .add({word: req.body.word, timestamp: Date.now()})
                    .then(() => {
                        res.redirect(`/cms/word-lists/${req.params.listId}`);
                    });
            });
    } else {
        res.redirect(`/cms/word-lists/${req.params.listId}`);
    }
}

exports.getWord = (req, res) => {
    db.collection("wordlists").doc(req.params.listId).listCollections()
        .then(collections => {
            const collectionId = collections[0].id;
            db.collection("wordlists").doc(req.params.listId).collection(collectionId).doc(req.params.wordId).get()
                .then(result => {
                    const word = result.data().word;
                    const uploadedImage = bucket.file(req.params.wordId);
                    uploadedImage.get()
                        .then(image => {
                            res.render("wordlists/word-detail", {
                                title: "CMS",
                                dest: "wordlists",
                                word: word,
                                listId: req.params.listId,
                                wordId: req.params.wordId,
                                hasImage: true,
                                image: image[1].mediaLink
                            });
                        })
                        .catch(() => {
                            res.render("wordlists/word-detail", {
                                title: "CMS",
                                dest: "wordlists",
                                word: word,
                                listId: req.params.listId,
                                wordId: req.params.wordId,
                                hasImage: false
                            });
                        });
                });
        });
}

exports.updateWord = (req, res) => {
    function insertWord(req, res) {
        db.collection("wordlists").doc(req.params.listId).listCollections()
            .then(collections => {
                const collectionId = collections[0].id;
                db.collection("wordlists").doc(req.params.listId).collection(collectionId).doc(req.params.wordId)
                    .update({word: req.body.word, timestamp: Date.now()})
                    .then(() => {
                        res.redirect(`/cms/word-lists/${req.params.listId}`);
                    });
            });
    }

    function deleteWord(req, res) {
        db.collection("wordlists").doc(req.params.listId).listCollections()
            .then(collections => {
                const collectionId = collections[0].id;
                db.collection("wordlists").doc(req.params.listId).collection(collectionId).doc(req.params.wordId)
                    .delete()
                    .then(() => {
                        res.redirect(`/cms/word-lists/${req.params.listId}`);
                    });
            });
    }

    if (!("save-word" in req.body)) {
        if (!("delete-word" in req.body)) {
            const {
                mimetype,
                buffer,
            } = req.files[0]
            const uploadedImage = bucket.file(req.params.wordId);

            uploadedImage.save(buffer, {
                public: true,
                contentType: mimetype
            }).then(() => {
                console.log("File uploaded")
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