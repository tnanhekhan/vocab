const express = require('express');
const fb = require("../firebase");
const db = fb.firestore();
const router = express.Router();

let wordCollection = db.collection('wordlists').doc('wordlist').collection("wordCollection");

router.get('/', (req, res, next) => {
    db.collection('wordLists').get()
        .then(snapshot => {
            console.log(snapshot)
            res.render("cms", {title: "CMS"});
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

router.post("/", (req, res, next) => {
    const word = req.body.word;
    wordCollection.add({word: word, timestamp: Date.now()}).then(ref => {
        res.render("cmsPost", {title: "CMS", uploadedWord: word})
    })
});

router.get("/db", (req, res, next) => {
    wordCollection.get()
        .then(snapshot => {
            let words = [];
            snapshot.forEach(doc => {
                words.push(`<li><a href="#" class="database-word" id=${doc.id}>${doc.data().word}</a></li>`)
            });
            res.send(`<!doctype html>
            <head>
                <title>DB</title>
            </head>
            <body>
                <a href="/">Home</a>
                <h1>DB</h1>
                <h2>All inserted words: </h2>
                <ul>
                    ${words.map(word => `${word}`).join('')}
                </ul>
                <script src="/js/db.js"></script>
            </body>
            </html>`);
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

router.post("/db", (req, res, next) => {
    const data = JSON.parse(req.body);
    wordCollection.doc(data.id).delete().then(
        success => {
            res.send(data)
        })
        .catch(error => {
            console.log("error failed: " + error)
        })
});

module.exports = router;