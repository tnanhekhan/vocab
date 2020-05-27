'use strict';

const functions = require('firebase-functions');
const {dialogflow, HtmlResponse,} = require('actions-on-google');

const appD = dialogflow({debug: true});

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
    .use('/cms', cmsRouter);

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