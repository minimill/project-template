'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cached');
var cssnano = require('gulp-cssnano');
var fs = require('fs');
var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var inlinesource = require('gulp-inline-source');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var layouts = require('handlebars-layouts');
var plumber = require('gulp-plumber');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var yaml = require('js-yaml');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var path = require('path');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./webpack.config');
var bundler = webpack(webpackConfig);


handlebars.Handlebars.registerHelper(layouts(handlebars.Handlebars));

gulp.task('sass:lint', function() {
  gulp.src('./src/sass/*.scss')
    .pipe(plumber())
    .pipe(scsslint());
});

gulp.task('sass:build', function() {
  gulp.src('./src/sass/**/style.scss')
    .pipe(rename({suffix: '.min'}))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
    }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('sass:optimized', function() {
  return gulp.src('./src/sass/**/style.scss')
    .pipe(rename({suffix: '.min'}))
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed',
    }))
    .pipe(autoprefixer())
    .pipe(cssnano({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('sass', ['sass:lint', 'sass:build']);

gulp.task('webpack:build', function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  // run webpack
  webpack(myConfig, function(err, stats) {
    callback();
  });
});

gulp.task('js:lint', function() {
  return gulp.src(['./src/js/**/*.js', '!./src/js/lib/**/*.js', 'Gulpfile.js'])
    .pipe(plumber())
      .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('js', ['js:lint', 'webpack:build']);

gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true,
    }))
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('images:optimized', function() {
  return gulp.src('src/img/**/*')
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true,
      multipass: true,
    }))
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('fonts', function() {
  return gulp.src('src/font/*')
    .pipe(plumber())
    .pipe(gulp.dest('./dist/font'));
});

gulp.task('templates', function() {
  var templateData = yaml.safeLoad(fs.readFileSync('data.yml', 'utf-8'));
  var options = {
    ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
    batch: ['./src/partials/'],
    helpers: {
      capitals: function(str) {
        return str.toUpperCase();
      },
    },
  };

  return gulp.src('./src/templates/**/*.hbs')
    .pipe(plumber())
    .pipe(handlebars(templateData, options))
    .pipe(rename(function(path) {
      path.extname = '.html';
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('templates:optimized', ['templates'], function() {
  return gulp.src('./dist/**/*.html')
    .pipe(inlinesource())
    .pipe(replace(/\.\.\//g, ''))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function(cb) {
  return rimraf('./dist/', cb);
});

gulp.task('watch', function() {
  gulp.watch(['./src/templates/**/*.hbs', './src/partials/**/*.hbs'], ['templates'], reload);
  gulp.watch('./src/sass/**/*.scss', ['sass'], reload);
  gulp.watch('./src/img/**/*', ['images'], reload);
  gulp.watch(['./src/js/**/*.js', 'Gulpfile.js'], ['js'], reload);
});

gulp.task('build', function (cb) {
  return runSequence('clean', ['sass', 'images', 'fonts', 'js', 'templates'], cb);
});

gulp.task('build:optimized', function(cb) {
  return runSequence('clean',
    ['sass:optimized', 'images:optimized', 'fonts', 'js', 'templates:optimized'],
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
      baseDir: './dist',
      middleware: [
        webpackDevMiddleware(bundler, {
          // IMPORTANT: dev middleware can't access config, so we should
          // provide publicPath by ourselves
          publicPath: webpackConfig.output.publicPath,

          // pretty colored output
          stats: { colors: true }

          // for other settings see
          // http://webpack.github.io/docs/webpack-dev-middleware.html
        }),

        // bundler should be the same as above
        webpackHotMiddleware(bundler)
      ]
    },

    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: [
      './dist/css/*.css',
      './dist/*.html'
    ]
  });

  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.start(['watch']);
});
