'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cached');
var fs = require('fs');
var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var imagemin = require('gulp-imagemin');
var inlinesource = require('gulp-inline-source');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var layouts = require('handlebars-layouts');
var minifyCss = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var plumber = require('gulp-plumber');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var shell = require('gulp-shell');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var yaml = require('js-yaml');

handlebars.Handlebars.registerHelper(layouts(handlebars.Handlebars));

gulp.task('sass:lint', function () {
  gulp.src('./src/sass/*.scss')
    .pipe(plumber())
    .pipe(scsslint());
});

gulp.task('sass:build', function () {
  gulp.src('./src/sass/**/style.scss')
    .pipe(rename({ suffix: '.min' }))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
    }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('sass:optimized', function () {
  gulp.src('./src/sass/**/style.scss')
    .pipe(rename({ suffix: '.min' }))
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed',
    }))
    .pipe(autoprefixer())
    .pipe(minifyCss({ compatibility: 'ie8' }))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('sass', ['sass:lint', 'sass:build']);

gulp.task('js:build', function () {
  gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('js:lint', function () {
  gulp.src(['./src/js/**/*.js', '!./src/js/lib/**/*.js', 'Gulpfile.js'])
    .pipe(plumber())
      .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('js', ['js:lint', 'js:build']);

gulp.task('images', function () {
  gulp.src('src/img/**/*')
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true,
    }))
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('images:optimized', function () {
  gulp.src('src/img/**/*')
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true,
      multipass: true,
    }))
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('fonts', function () {
  gulp.src('src/font/*')
    .pipe(plumber())
    .pipe(gulp.dest('./dist/font'));
});

gulp.task('templates', function () {
  var templateData = yaml.safeLoad(fs.readFileSync('data.yml', 'utf-8'));
  var options = {
    ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
    batch: ['./src/partials/'],
    helpers: {
      capitals: function (str) {
        return str.toUpperCase();
      },
    },
  };

  return gulp.src('./src/templates/**/*.hbs')
    .pipe(plumber())
    .pipe(handlebars(templateData, options))
    .pipe(rename(function (path) {
      path.extname = '.html';
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('templates:optimized', ['templates'], function () {
  gulp.src('./dist/**/*.html')
    .pipe(inlinesource())
    .pipe(replace(/\.\.\//g, ''))
    .pipe(minifyHTML({
      conditionals: true,
      spare:true,
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
  gulp.watch(['./src/templates/**/*.hbs', './src/partials/**/*.hbs'], ['templates'], reload);
  gulp.watch('./src/sass/**/*.scss', ['sass'], reload);
  gulp.watch('./src/img/**/*', ['images'], reload);
  gulp.watch(['./src/js/**/*.js', 'Gulpfile.js'], ['js'], reload);
});

gulp.task('build', ['sass', 'images', 'fonts', 'js', 'templates']);
gulp.task('build:optimized', ['sass:optimized', 'images:optimized', 'fonts', 'js', 'templates:optimized']);

gulp.task('deploy', ['build:optimized'], function () {
  gulp.src('')
    .pipe(shell('scp -r dist/* root@minimill.co:/srv/work/private_html/TITLE/'))
    .on('finish', function () {
      process.stdout.write('Deployed to work.minimill.co/TITLE/');
    });
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['build'], function () {

  // Serve files from the root of this project
  browserSync.init(['./dist/**/*'], {
    server: {
      baseDir: './dist',
    },
  });

  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.start(['watch']);
});
