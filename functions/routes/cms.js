const express = require('express');
const fb = require("../firebase");
const db = fb.firestore();
const router = express.Router();

let wordCollection = db.collection('wordlists').doc('wordlist').collection("wordCollection");

router.get("/", (req, res, next) => {
    res.render("dashboard/dashboard", {title: "CMS", dest: "dashboard"});
});

router.get('/word-lists', (req, res, next) => {
    db.collection('wordlists').get()
        .then(snapshot => {
            return snapshot.docs;
        })
        .then(wordLists => {
            res.render("wordlists/wordlists-get", {title: "CMS", dest: "wordlists", wordLists: wordLists});
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

router.get('/word-lists/add', (req, res, next) => {
    res.render("wordlists/add-wordlist", {title: "CMS", dest: "wordlists"});
});

router.get('/word-lists/:listId', (req, res, next) => {
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
                        listId: req.params.listId
                    });
                })
        });
});

router.get("/word-lists/:listId/add", (req, res, next) => {
    res.render("wordlists/word-detail", {
        title: "CMS",
        dest: "wordlists",
        word: "",
        listId: req.params.listId,
    });
});

router.post("/word-lists/:listId/add", (req, res, next) => {
    if ("save-word" in req.body && req.body.word) {
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
});

router.get("/word-lists/:listId/:wordId", (req, res, next) => {
    db.collection("wordlists").doc(req.params.listId).listCollections()
        .then(collections => {
            const collectionId = collections[0].id;
            db.collection("wordlists").doc(req.params.listId).collection(collectionId).doc(req.params.wordId).get()
                .then(result => {
                    res.render("wordlists/word-detail", {
                        title: "CMS",
                        dest: "wordlists",
                        word: result.data().word,
                        listId: req.params.listId,
                        wordId: req.params.wordId,
                    });
                });
        });
});

router.post("/word-lists/:listId/:wordId", (req, res, next) => {
    if ("save-word" in req.body && req.body.word) {
        db.collection("wordlists").doc(req.params.listId).listCollections()
            .then(collections => {
                const collectionId = collections[0].id;
                db.collection("wordlists").doc(req.params.listId).collection(collectionId).doc(req.params.wordId)
                    .update({word: req.body.word, timestamp: Date.now()})
                    .then(() => {
                        res.redirect(`/cms/word-lists/${req.params.listId}`);
                    });
            });
    } else {
        res.redirect(`/cms/word-lists/${req.params.listId}`);
    }
});

module.exports = router;