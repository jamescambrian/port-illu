var gulp = require('gulp');
var connect = require('gulp-connect');
var colors = require('colors');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var fileinclude = require('gulp-file-include');
var gulpIgnore = require('gulp-ignore');
var uglify = require('gulp-uglify');

gulp.task('sass', function() {
  return sass('./scss/main.scss', {
    sourcemap: true
  })
  .pipe(sourcemaps.write('./', {
    includeContent: false,
    sourceRoot: '/scss'
  }))
  .pipe(gulp.dest('./css'))
  .pipe(gulpIgnore.exclude(function(file) {
    if (file.path.indexOf('.map') !== -1) {
      return true;
    } else {
      return false;
    }
  }))
  .pipe(minifyCss())
  .pipe(rename({
    extname: '.min.css'
  }))
  .pipe(gulp.dest('./css'))
  .on('error', function (err) {
    console.error(err.message);
  })
  .pipe(connect.reload());
});

gulp.task('scripts', function() {
  return gulp.src([
    'scripts/vendor/jquery*.js',
    'scripts/vendor/*.js',
    'scripts/plugins.js',
    'scripts/common.js'
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('main.js'))
  .pipe(gulp.dest('./js/'))
  .pipe(uglify())
  .pipe(rename({
    extname: '.min.js'
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./js/'))
});

gulp.task('default', ['sass', 'scripts'], function() {
  // Start a server
  connect.server({
    root: '',
    port: 3000,
    livereload: true
  });
  console.log('[CONNECT] Listening on port 3000'.yellow.inverse);

  console.log('[CONNECT] Watching files for live-reload'.blue);
  watch(['./index.html', './scripts/vendor/*.js', './scripts/*.js'])
    .pipe(connect.reload());

  console.log('[CONNECT] Watching SASS files'.blue);
  gulp.watch(['./scripts/vendor/*.js', './scripts/*.js'], ['scripts']);
  
  console.log('[CONNECT] Watching SASS files'.blue);
  gulp.watch('./scss/**/*.scss', ['sass']);
});

