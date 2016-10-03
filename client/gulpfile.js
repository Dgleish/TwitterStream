var gulp        = require('gulp');
var gutil       = require('gulp-util');
var source      = require('vinyl-source-stream');
var babelify    = require('babelify');
var exorcist    = require('exorcist');
var watchify    = require('watchify');
var browserify  = require('browserify');
var browserSync = require('browser-sync').create();

watchify.args.debug = true;

var bundler = watchify(browserify('./src/js/index.js'));

bundler.transform(babelify.configure({
    sourceMapRelative: 'src'
}));

bundler.on('update', bundle);

function bundle() {
    gutil.log('Compiling JS...');

    return bundler.bundle()
        .on('error', function (err) {
            gutil.log(err.message);
            browserSync.notify("Browserify error");
            this.emit("end");
        })
        .pipe(exorcist('dist/bundle.js.map'))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream({once: true}));
}

gulp.task('bundle', function() {
    return bundle();
});

gulp.task('default', ['bundle'], function() {
    browserSync.init({
        server: "./"
    });
});

