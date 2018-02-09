// ##############################
// ## !!! WORK IN PROGRESS !!! ##
// ##############################

const gulp     = require('gulp');
const sass     = require('gulp-sass');
const imagemin = require('gulp-imagemin');

// High-level ------------------------------------------------------------------

gulp.task('unitTest', ['unitFront', 'unitBack'], function() {
  return console.log('You need tests to actually perform unit tests...');
  process.exit(0);
});

gulp.task('integrationTest', ['integrateFront', 'integrateBack'], function() {
  return console.log('You need tests to actually perform integration tests...');
  process.exit(0);
});

// Test Suites  ----------------------------------------------------------------

gulp.task('unitFront', function() {
  process.exit(0);
});

gulp.task('unitBack', function() {
  process.exit(0);
});

gulp.task('integrateFront', function() {
  process.exit(0);
});

gulp.task('integrateBack', function() {
  process.exit(0);
});

// Utilities -------------------------------------------------------------------

gulp.task('clean', function() {
  return console.log('Clean is not yet implemented.');
  process.exit(0);
});

gulp.task('sassy', function () {
  return gulp.src('./frontend/src/sass/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./frontend/src/'));
});

gulp.task('optimizeImg', function() {

});

// Watchers --------------------------------------------------------------------

gulp.task('watch', function() {
  return console.log('Watch is not yet implemented.');
  process.exit(0);
});

gulp.task('sassy:watch', function () {
  gulp.watch('./frontend/src/sass/**/*.scss', ['sassy']);
});
