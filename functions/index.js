'use strict';
//const dialogFlowApp = require("./DialogflowApp");
const bodyParser = require("body-parser");
const {
    dialogflow,
    HtmlResponse
} = require("actions-on-google");

const fb = require("./firebase");
const db = fb.firestore();
const functions = require('firebase-functions');

let wordCollection = db.collection('wordlists').doc('wordlist').collection("wordCollection");

// Instantiate the Dialogflow client.
const appD = dialogflow({ debug: true });

const createError = require('http-errors');
const path = require('path');
const express = require('express');
const cmsRouter = require('./routes/cms');
const app = express();

app.set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.json())
    .use(express.urlencoded({extended: false}))
    .use('/cms', cmsRouter)
    .use(bodyParser.json());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {title: "404"});
});


appD.intent('Welcome', (conv) => {
    if(!conv.surface.capabilities.has('actions.capability.INTERACTIVE_CANVAS')){
        conv.close('sorrie, dit apparaat kan deze app niet ondersteunen');
        return;
    }
    conv.ask('hi, welkom in de vocab app, ben je klaar?');
    conv.ask(new HtmlResponse({
        url: 'https://vocab-project.firebaseapp.com/',
    }));

});

appD.intent('Woorden', (conv) => {
    /*return wordCollection.get().then(snapshot => {
        let woorden = [];
        snapshot.forEach(woord => {
            woorden.push(woord.data().word)
            conv.ask(woord.data().word);
        });
        console.log('woorden ', woorden);

        conv.ask(new HtmlResponse({
            data: {
                words: woorden
            }
        }));
    });*/

    conv.ask('yo');
    conv.ask(new HtmlResponse({
        data: {
            test: 'woordjes',
            woord: 'woorden'
        }
    }));
});

appD.intent('woordOefenen', (conv, spokenWord) => {
    conv.data.guess = 0;
    if(spokenWord !== woord){
        conv.data.guess++;
        //herhaal
    } else {
        //verstuur ${woord} naar db met ${conv.data.guess}
    }
});

appD.intent('Fallback', (conv) => {
    conv.close('Er gaat wat mis');
    conv.ask(new HtmlResponse());
});

appD.intent('Hallo', (conv) => {
    conv.close('Hi');
    conv.ask(new HtmlResponse());
});

exports.app = functions.https.onRequest(app);
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(appD);