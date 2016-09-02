'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cached');
var cp = require('child_process');
var cssnano = require('gulp-cssnano');
var cache = require('gulp-cache');
var del = require('del');
var es = require('event-stream');
var foreach = require('gulp-foreach');
var fs = require('fs');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var path = require('path');
var plumber = require('gulp-plumber');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var shell = require('gulp-shell');
var sizeOf = require('image-size');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
  jekyllBuild: '<span style="color: grey">Running: </span> $ jekyll build'
};
var responsiveSizes = [20, 200, 800, 1600];

/************
 **  SCSS  **
 ************/

gulp.task('scss', ['scss:lint', 'scss:build']);

gulp.task('scss:lint', function() {
  gulp.src(['./_scss/**/*.scss', '!./_scss/lib/**/*.scss'])
    .pipe(plumber())
    .pipe(scsslint());
});

gulp.task('scss:build', function() {
  gulp.src('./_scss/style.scss')
    .pipe(plumber())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['scss'],
      onError: browserSync.notify,
      outputStyle: 'compressed',
    }))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./_site/css/'))
    .pipe(reload({stream: true}))
    .pipe(gulp.dest('./css/'));
});

gulp.task('scss:optimized', function() {
  return gulp.src('./_scss/style.scss')
    .pipe(plumber())
    .pipe(rename({suffix: '.min'}))
    .pipe(sass({
      includePaths: ['scss'],
      outputStyle: 'compressed',
    }))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(cssnano({compatibility: 'ie8'}))
    .pipe(gulp.dest('./_site/css/'))
    .pipe(reload({stream: true}))
    .pipe(gulp.dest('./css/'));
});

/******************
 **  JavaScript  **
 ******************/
gulp.task('js', ['js:lint', 'js:build']);

gulp.task('js:build', function() {
  return gulp.src('./_js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./_site/js/'))
    .pipe(reload({stream: true}))
    .pipe(gulp.dest('./js/'));
});

gulp.task('js:lint', function() {
  return gulp.src(['./_js/**/*.js', '!./_js/lib/**/*.js', 'Gulpfile.js'])
    .pipe(plumber())
      .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/**********************
 ** Optimized Images **
 **********************/

gulp.task('images', /* ['responsive'], */ function() {
  return gulp.src('./_img/**/*')
    .pipe(plumber())
    .pipe(cache(imagemin({
      progressive: true,
    })))
    .pipe(gulp.dest('./_site/img/'))
    .pipe(reload({stream: true}))
    .pipe(gulp.dest('./img/'));
});

gulp.task('images:optimized',  /* ['responsive'], */ function() {
  return gulp.src('./img/res/**/*')
    .pipe(plumber())
    .pipe(cache(imagemin({
      interlaced: true,
      pngquant: true,
      progressive: true,
      multipass: true,
    })))
    .pipe(gulp.dest('./_site/img/'))
    .pipe(reload({stream: true}))
    .pipe(gulp.dest('./img/'));
});

/***********************
 ** Responsive Images **
 ***********************/

gulp.task('responsive', function (cb) {
  return runSequence('responsive:clean', ['responsive:resize', 'responsive:metadata'], cb);
});

gulp.task('responsive:resize', function() {
  return es.merge(responsiveSizes.map(function(size) {
    return gulp.src('./_img/res/raw/**/*')
      .pipe(plumber())
      .pipe(imageResize({
        height: size,
        width: 0,
        crop: false,
        upscale: false,
        imageMagick: true
      }))
      .pipe(gulp.dest('./_img/res/' + size + '/'));
  }));
});

gulp.task('responsive:metadata', function() {
  var metadata = {
    _NOTE: "This file is generated in gulpfile.js, in the responsive:metadata task.",
    aspectRatios: {},
    sizes: responsiveSizes,
  };
  return gulp.src('./_img/res/raw/**/*.{jpg,png,JPG,PNG}')
    .pipe(foreach(function(stream, file) {
      var key = file.path.replace(/.*\/_img\/res\/raw\//, '')
      var dimensions = sizeOf(file.path);
      metadata.aspectRatios[key] = Number((dimensions.width / dimensions.height).toFixed(3));
      return stream;
    }))
    .on('finish', function() {
      fs.writeFileSync('./_data/responsiveMetadata.json', JSON.stringify(metadata, null, 2))
    });
});

gulp.task('responsive:clean', function(cb) {
  return del(['_img/res/*', '!_img/res/raw/', '!_img/res/raw/**'], cb);
});

/************
 ** Jekyll **
 ************/

gulp.task('jekyll', ['jekyll:build']);

gulp.task('jekyll:build', function(cb) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn(jekyll, ['build'], {stdio: 'inherit'}).on('close', cb);
});

gulp.task('jekyll:rebuild', ['jekyll:build'], function() {
  reload();
});

/******************
 ** Global Tasks **
 ******************/

gulp.task('clean', function(cb) {
  return del(['./_site/', './css/', './js/', './img/'], cb);
});

gulp.task('deploy', ['build:optimized'], function() {
  gulp.src('')
    .pipe(shell('scp -r _site/* root@minimill.co:/srv/work/private_html/TITLE/'))
    .on('finish', function() {
      process.stdout.write('Deployed to work.minimill.co/TITLE/');
    });
});

gulp.task('watch', function() {
  gulp.watch([
    './*.html',
    './_layouts/*.html',
    './_includes/*.html',
    './_drafts/*.html',
    './_posts/*',
    './_data/*',
    './_config.yml'], ['jekyll:rebuild']);
  gulp.watch('./_scss/**/*.scss', ['scss']);
  gulp.watch('./img/res/**/*', ['images']);
  gulp.watch(['./_js/**/*.js', 'Gulpfile.js'], ['js']);
});

gulp.task('build', function (cb) {
  return runSequence('clean', ['scss', 'images', 'js', 'jekyll'], cb);
});

gulp.task('build:optimized', function(cb) {
  return runSequence('clean',
    ['scss:optimized', 'images:optimized', /*'responsive',*/ 'js', 'jekyll'],
    cb);
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['build'], function() {

  // Serve files from the root of this project
  browserSync.init(['./dist/**/*'], {
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false,
    },
    server: {
      baseDir: '_site',
    },
  });

  gulp.start(['watch']);
});

gulp.task('default', ['serve']);
