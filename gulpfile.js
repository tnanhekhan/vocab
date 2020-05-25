const gulp = require('gulp');
const replace = require('gulp-replace')

function defaultTask(cb) {
    gulp.src("functions/index.js")
        .pipe(replace("admin.initializeApp({credential: credential, databaseURL: databaseURL});", "admin.initializeApp();"))
        .pipe(gulp.dest('functions/'));

    cb();
}

exports.default = defaultTask