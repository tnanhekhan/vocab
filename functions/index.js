'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./admin.json');
const {dialogflow,
    HtmlResponse,
} = require('actions-on-google');

const appD = dialogflow({debug: true});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: functions.config().database.url
});
const db = admin.firestore();

const express = require('express');
const app = express();

let wordCollection = db.collection('wordlists').doc('wordlist').collection("wordCollection");

app.get("/cms", (req, res) => {
    res.send(`<!doctype html>
    <head>
      <title>CMS</title>
    </head>
    <body>
      </q><a href="/">Home</a>
      <h1>CMS</h1>
      <form method="post" >
        <label for="fname">Word for database</label><br>
        <input type="text" id="word" name="word" placeholder="Enter a word here:" required><br>
        <input type="submit" value="Submit Word">
        </form> 
    </body>
  </html>`)
});

app.post("/cms", (req, res) => {
    const word = req.body.word;
    wordCollection.add({word: word, timestamp: Date.now()}).then(ref => {
        res.send(`<!doctype html>
            <head>
            <title>CMS</title>
            </head>
            <body>
                <a href="/">Home</a>
                <h1>CMS</h1>
                <h2>Uploaded word : ${word}</h2>
                 <form method="post" >
                    <label for="fname">Word for database</label><br>
                    <input type="text" id="word" name="word" placeholder="Enter a word here:" required><br>
                    <input type="submit" value="Submit Word">
                  </form> 
            </body>
            </html>`);
    })
});

app.get("/db", (req, res) => {
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
                <script src="js/db.js"></script>
            </body>
            </html>`);
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

app.post("/db", (req, res) => {
    const data = JSON.parse(req.body);
    wordCollection.doc(data.id).delete().then(
        success => {
            res.send(data)
        })
        .catch(error => {
            console.log("error failed: " + error)
        })
});

appD.intent('welcome', (conv) => {
    if(!conv.surface.capabilities.has('actions.capability.INTERACTIVE_CANVAS')){
        conv.close('sorrie, dit apparaat kan deze app niet ondersteunen');
        return;
    }
    conv.ask('hi, welkom in de vocab app');
    return wordCollection.doc('Xw957bRoA6Z7DKoVh74b').get()
        .then(doc => {
            conv.ask(doc.data().word);
            conv.ask(new HtmlResponse({
                url: 'https://vocab-project.firebaseapp.com/',
                data: {
                    words: doc.data().word
                }
            }));
        });
});

exports.app = functions.https.onRequest(app);
exports.appD = functions.https.onRequest(appD);