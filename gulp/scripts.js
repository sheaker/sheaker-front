'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var gulpNgConfig = require('gulp-ng-config');

gulp.task('scripts', function () {
  gulp.src('app-config.json')
  .pipe(gulpNgConfig('sheaker.config', {
    environment: conf.options.mode
  }))
  .pipe(gulp.dest(conf.paths.src + '/app/'));

  return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe($.size())
});
