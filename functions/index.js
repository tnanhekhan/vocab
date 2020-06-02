'use strict';

const functions = require('firebase-functions');

//import dialogflow app
const app = require('./dialogflowApp');

const createError = require('http-errors');
const path = require('path');
const express = require('express');
const cmsRouter = require('./routes/cms');
const expressApp = express();

expressApp.set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.json())
    .use(express.urlencoded({extended: false}))
    .use('/cms', cmsRouter);

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

exports.expressApp = functions.https.onRequest(expressApp);
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);