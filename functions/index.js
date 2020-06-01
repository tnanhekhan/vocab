'use strict';

const {
    dialogflow,
    HtmlResponse
} = require("actions-on-google");
const fb = require("./firebase");
const db = fb.firestore();
const functions = require('firebase-functions');

let wordCollection = db.collection('wordlists').doc('wordlist').collection("wordCollection");

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

const createError = require('http-errors');
const path = require('path');
const express = require('express');
const cmsRouter = require('./routes/cms');
const wordListsRouter = require('./routes/word-lists');
const expressApp = express();

expressApp.set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.json())
    .use(express.urlencoded({extended: false}))
    .use('/cms', cmsRouter)
    .use('/cms/word-lists', wordListsRouter);

// catch 404 and forward to error handler
expressApp.use(function (req, res, next) {
    next(createError(404));
});

// error handler
expressApp.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {title: "404", dest: "404"});
});

const MAX_INCORRECT_GUESSES = 3;

app.intent('Welcome', conv => {
    if (!conv.surface.capabilities.has('actions.capability.INTERACTIVE_CANVAS')) {
        conv.close('sorrie, dit apparaat kan deze app niet ondersteunen');
        return;
    }
    conv.ask('hi, welkom in de vocab app, ben je klaar?');
    conv.ask(new HtmlResponse({
        url: 'https://vocab-project.firebaseapp.com/',
        data: {
            event: 'WELCOME',
        },
    }));
});

let index = 0;
let woorden = [];

app.intent('Begin', conv => {
    return wordCollection.get().then(snapshot => {
        snapshot.forEach(woord => {
            woorden.push(woord.data().word);
        });
        conv.ask(woorden[index]);
        conv.ask(new HtmlResponse({
            data: {
                event: 'OEFENEN',
                woord: woorden[index]
            }
        }));
    });
});

app.intent('Woordjes', (conv, {gesprokenWoord}) => {
    console.log('index ', index, ' ', woorden.length - 1);
    if (index === woorden.length-1) {
        console.log('einde');
        conv.close('Goed gedaan!');
        conv.ask(new HtmlResponse({
            data: {
                event: 'KLAAR'
            }
        }));
    } else {
        console.log('inhoud ', woorden);
        if (gesprokenWoord !== woorden[index]) {
            //herhaal
        } else {
            //verstuur ${index} naar db met ${conv.data.guess}
            index += 1;
        }

        conv.ask(woorden[index]);
        conv.ask(new HtmlResponse({
            data: {
                event: 'OEFENEN',
                woord: woorden[index]
            }
        }));
    }
});

app.intent('Fallback', conv => {
    conv.close('Er gaat wat mis');
});

app.catch((conv, error) => {
    console.error(error);
    conv.ask('I encountered a glitch. Can you say that again?');
});

exports.expressApp = functions.https.onRequest(expressApp);
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);