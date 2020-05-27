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
            let wordlists = []
            snapshot.forEach(doc => {
                wordlists.push(doc)
            });
            return wordlists
        })
        .then(wordLists => {
            res.render("wordlists/wordlists-get", {title: "CMS", dest: "wordlists", wordLists: wordLists});
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

router.post("/word-lists", (req, res, next) => {
    const word = req.body.word;
    wordCollection.add({word: word, timestamp: Date.now()}).then(ref => {
        res.render("wordlists/wordlists-post", {title: "CMS", uploadedWord: word});
    })
});

router.get('/word-lists/add', (req, res, next) => {
    res.render("wordlists/add", {title: "CMS", dest: "wordlists"});
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
                    res.render("wordlists/words", {title: "CMS", dest: "wordlists", words: words, listId: req.params.listId});
                })
        });
});

module.exports = router;