'use strict';

const functions = require('firebase-functions');
const createError = require('http-errors');
const fileMiddleware = require('express-multipart-file-parser')
const path = require('path');
const cookieParser = require("cookie-parser");
const compression = require('compression');
const express = require('express');
const legalRouter = require("./routes/legal");
const cmsRouter = require('./routes/cms');
const wordListsRouter = require('./routes/word-lists');
const classListsRouter = require('./routes/class-lists');
const usersRouter = require('./routes/users')
const expressApp = express();
const dialogflow = require('./dialogflow/dialogflowApp');

expressApp.set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(fileMiddleware)
    .use(cookieParser())
    .use(compression())
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.json())
    .use(express.urlencoded({extended: true}))
    .use('/', legalRouter)
    .use('/cms', cmsRouter)
    .use('/cms/word-lists', wordListsRouter)
    .use('/cms/class-lists', classListsRouter)
    .use('/cms/users', usersRouter);

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
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(dialogflow);