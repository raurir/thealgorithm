var con = console;

var babel = require('babelify');
var beep = require('beepbeep');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var jade = require('gulp-jade');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var watchify = require('watchify');


var onError = function(err) {
  notify.onError({
    title:    "Gulp error in " + err.plugin,
    message:  err.toString()
  })(err);
  beep(3);
  this.emit('end');
};


function compile(watch) {

  var bundler = browserify(['./src/js/thealgorithm.js'], { debug: true }).transform(babel);
  // var bundler = browserify([], { debug: true }).transform(babel);
  if (watch) {
    bundler = watchify(bundler);
  }

  function rebundle() {
    compileJavascript();
    compileJade();
    compileStylus();
    copyImages();
  }

  function compileJavascript() {
    con.log("compileJavascript");
    bundler.bundle()
      .on('error', onError)
      .on('end', () => con.log("compileJavascript complete"))
      .pipe(source('thealgorithm.js'))
      // .pipe(plumber({ errorHandler: onError }))
      .pipe(buffer())
      // .pipe(uglify())
      // .pipe(sourcemaps.init({ loadMaps: true }))
      // .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest("deploy/js"));
  }

  if (watch) {

    gulp.watch('src/jade/*.jade', ['compileJade']);
    gulp.watch('src/stylus/*.styl', ['compileStylus']);
    gulp.watch('src/images/**/*', ['copyImages']);

    bundler.on('update', function() {
      compileJavascript();
    });
  }

  rebundle();
}

function watch() {
  con.log("watch");
  return compile(true);
};

function compileJade() {
  con.log("compileJade");
  return gulp.src('src/jade/*.jade')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(jade({
      pretty: true,
      data: {
        siteTitle: "title"
      }
    }))
    .pipe(gulp.dest('deploy/'));
}

function compileStylus() {
  con.log("compileStylus");
  return gulp.src('src/stylus/*.styl')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('deploy/css/'));
}

function copyImages() {
  con.log("copyImages");
  return gulp.src(['src/images/**/*'])
    .pipe(gulp.dest('deploy/images/'));
}

gulp.task('compileJade', compileJade);
gulp.task('compileStylus', compileStylus);
gulp.task('copyImages', copyImages);
gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });
gulp.task('default', ['watch']);