const express = require('express');
const fb = require("../firebase");
const db = fb.firestore();
const router = express.Router();

// Routes to the dashboard
router.get("/", (req, res, next) => {
    res.render("dashboard/dashboard", {title: "CMS", dest: "dashboard"});
});

// Routes to the all the word lists
router.get('/word-lists', (req, res, next) => {
    db.collection('wordlists').get()
        .then(snapshot => {
            snapshot.docs.forEach(doc => {
                if (doc.data().name.length === 0 && doc.data().created) {
                    db.collection("wordlists").doc(doc.id).delete();
                }
            });
            return snapshot.docs;
        })
        .then(wordLists => {
            res.render("wordlists/wordlists", {title: "CMS", dest: "wordlists", wordLists: wordLists});
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

// Routes to the the word list choice screen between manual or load a file
router.get('/word-lists/add-list', (req, res, next) => {
    res.render("wordlists/wordlist-add-choice", {title: "CMS", dest: "wordlists"});
});

// Routes to the the manual word list screen
router.get('/word-lists/add-list/manual', (req, res, next) => {
    const now = Date.now();
    db.collection("wordlists").add({name: "", created: now})
        .then(() => {
            db.collection("wordlists").get()
                .then(snapshot => {
                    return snapshot.docs;
                })
                .then(wordlists => {
                    wordlists.forEach(wordlist => {
                        if (wordlist.data().created === now) {
                            res.render("wordlists/words", {
                                title: "CMS",
                                dest: "wordlists",
                                words: [],
                                listId: wordlist.id,
                                listName: ""
                            });
                        }
                    })
                });
        });
});

// Redirect logic when creating a word list manually
router.post('/word-lists/add-list/manual', (req, res, next) => {
    if ("save-wordlist" in req.body && req.body.listName.trim()) {
        db.collection("wordlists").doc(req.body.listId)
            .update({name: req.body.listName})
            .then(() => {
                db.collection("wordlists").doc(req.body.listId).collection("wordcollection")
                    .add({word: "Voorbeeldwoord", timestamp: Date.now()})
                    .then(() => {
                        res.redirect(`/cms/word-lists/${req.body.listId}`);
                    });
            });
    } else if ("delete-wordlist" in req.body) {
        db.collection("wordlists").doc(req.body.listId)
            .delete()
            .then(() => {
                res.redirect("/cms/word-lists");
            });
    } else {
        res.redirect("/cms/word-lists");
    }
});

// Routes to the words of a wordlist
router.get('/word-lists/:listId', (req, res, next) => {
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
});

// Redirect logic for updating an existing word list
router.post('/word-lists/:listId', (req, res, next) => {
    if ("save-wordlist" in req.body && req.body.listName.trim()) {
        db.collection("wordlists").doc(req.params.listId)
            .update({name: req.body.listName})
            .then(() => {
                res.redirect("/cms/word-lists");
            });
    } else if ("delete-wordlist" in req.body) {
        db.collection("wordlists").doc(req.params.listId)
            .delete()
            .then(() => {
                res.redirect("/cms/word-lists");
            });
    } else {
        res.redirect("/cms/word-lists");
    }
});

// Routes to the word detail page of a word that is going to be added
router.get("/word-lists/:listId/add", (req, res, next) => {
    res.render("wordlists/word-detail", {
        title: "CMS",
        dest: "wordlists",
        word: "",
        listId: req.params.listId,
    });
});

// Redirect logic for inserting a new word
router.post("/word-lists/:listId/add", (req, res, next) => {
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
});

// Routes to the word detail page of a word that already exists
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

// Redirect logic for updating an existing word
router.post("/word-lists/:listId/:wordId", (req, res, next) => {
    if ("save-word" in req.body && req.body.word.trim()) {
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