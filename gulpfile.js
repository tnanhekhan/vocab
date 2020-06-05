const gulp = require('gulp');
const replace = require('gulp-replace');

function defaultTask(cb) {
    gulp.src("functions/firebase.js")
        .pipe(replace("admin.initializeApp({credential: credential, databaseURL: databaseURL});", "admin.initializeApp({storageBucket: storageBucket});"))
        .pipe(replace("const serviceAccount = require('./admin.json');", ""))
        .pipe(replace("const credential = admin.credential.cert(serviceAccount);", ""))
        .pipe(replace("const databaseURL = functions.config().database.url;", ""))
        .pipe(gulp.dest('functions/'));

    cb();
}

exports.default = defaultTask