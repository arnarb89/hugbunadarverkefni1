'use strict';

var gulp = require('gulp');
//var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var jshint = require('gulp-jshint');

var isProd = false;

/*
gulp.task('styles', function() {
  gulp.src('./public/stylesheets/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/dist/stylesheets'))
    .pipe(browserSync.stream());
});*/


// We need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon.
// Increase this delay if browser-sync won't reload for you.
var BROWSER_SYNC_RELOAD_DELAY = 500;
gulp.task('nodemon', function (cb) {
  var started = false;
  var enviroment = isProd ? 'production' : 'development';

  return nodemon({
    script: 'bin/www',
    ext: 'js pug json css',
    env: { 'NODE_ENV': enviroment },
    // watch core server file(s) that require server restart on change
    watch: ['bin/www', 'app.js','routes/**/*','public/**/*','passport/**/*','cs-managers/**/*','cs-DBcontroller/**/*','social/**/*', 'views/**/*', 'lib/*']
  }).on('start', function () {
    // to avoid nodemon being started multiple times°l
    if (!started) {
      cb();
      started = true;
    }
  })
  .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      reloadBrowser(BROWSER_SYNC_RELOAD_DELAY);
  });
});
function reloadBrowser(delay) {
  if(delay) {
    setTimeout(function reload() {
      browserSync.reload();
    }, delay);
  } else {
    browserSync.reload();
  }
}


gulp.task('browser-sync', function() {
    browserSync.init(null, {
      proxy: 'http://localhost:3000',
      port: 8080,
    });
    //gulp.watch('./public/stylesheets/**/*.scss', ['styles']);
});

gulp.task('jshint', function() {
  return gulp.src(['./public/javascripts/*.js','./routes/*.js','./lib/*.js','./lib/managers/*.js','./passport/*.js','./social/*.js','./cs-managers/*.js','./cs-DBcontroller/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('setProdEnv', function() { isProd = true; });


gulp.task('serve', ['nodemon', 'browser-sync'/*, 'styles'*/]);
// set production enviroment, then serve.
gulp.task('serve-prod', ['setProdEnv','serve']);
gulp.task('default', ['serve']);
// gulp.task('default', ['jshint', 'serve']);