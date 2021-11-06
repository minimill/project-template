const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const cache = require("gulp-cached");
const cp = require("child_process");
const cssnano = require("gulp-cssnano");
const del = require("del");
const eslint = require("gulp-eslint");
const fs = require("fs");
const gulp = require("gulp");
const handlebars = require("gulp-compile-handlebars");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const inlinesource = require("gulp-inline-source");
const jshint = require("gulp-jshint");
const layouts = require("handlebars-layouts");
const plumber = require("gulp-plumber");

const { reload } = browserSync;
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const sass = require("gulp-sass")(require("sass"));
const scsslint = require("gulp-scss-lint");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const yaml = require("js-yaml");
const path = require("path");

handlebars.Handlebars.registerHelper(layouts(handlebars.Handlebars));
handlebars.Handlebars.registerHelper("reverse", (arr) => {
  arr.reverse();
});
handlebars.Handlebars.registerHelper(
  "ifEquals",
  function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  }
);

function catchErr(e) {
  console.log(e.messageFormatted);
  this.emit("end");
}

gulp.task("reload", (done) => {
  done();
  reload();
});

gulp.task("sass:lint", () =>
  gulp.src("./src/sass/**/*.scss").pipe(plumber()).pipe(scsslint())
);

gulp.task("sass:build", () =>
  gulp
    .src(["./src/sass/**/*.scss", "!./src/sass/**/_*.scss"])
    .pipe(rename({ suffix: ".min" }))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .on("error", catchErr)
    .pipe(
      autoprefixer({
        browsers: ["last 1 version", "> 0.2%"],
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./dist/css/"))
);

gulp.task("sass:optimized", () =>
  gulp
    .src(["./src/sass/**/*.scss", "!./src/sass/**/_*.scss"])
    .pipe(rename({ suffix: ".min" }))
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .pipe(autoprefixer())
    .pipe(cssnano({ compatibility: "ie8" }))
    .pipe(gulp.dest("dist/css/"))
);

gulp.task("sass", gulp.series("sass:lint", "sass:build"));

gulp.task("js:build", () =>
  gulp
    .src("src/js/**/*.js")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/js"))
);

gulp.task("js:lint", () =>
  gulp
    .src(["./src/js/**/*.js", "!./src/js/lib/**/*.js", "Gulpfile.js"])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
);

gulp.task("js", gulp.series("js:lint", "js:build"));

gulp.task("images", () =>
  gulp
    .src("src/img/**/*")
    .pipe(plumber())
    // .pipe(imagemin({
    //   progressive: true,
    // }))
    .pipe(gulp.dest("./dist/img"))
);

gulp.task("images:optimized", () =>
  gulp
    .src("src/img/**/*")
    .pipe(plumber())
    .pipe(
      imagemin({
        progressive: true,
        multipass: true,
      })
    )
    .pipe(gulp.dest("./dist/img"))
);

gulp.task("resources", () =>
  gulp
    .src("src/resources/*")
    .pipe(plumber())
    .pipe(gulp.dest("./dist/resources"))
);

gulp.task("fonts", () =>
  gulp.src("src/font/*").pipe(plumber()).pipe(gulp.dest("./dist/font"))
);

gulp.task("templates", () => {
  const templateData = yaml.safeLoad(fs.readFileSync("data.yml", "utf-8"));
  const options = {
    ignorePartials: true, // ignores the unknown footer2 partial in the handlebars template, defaults to false
    batch: ["./src/partials/"],
    helpers: {},
  };

  return gulp
    .src("./src/templates/**/*.hbs")
    .pipe(plumber())
    .pipe(handlebars(templateData, options))
    .pipe(
      rename((path) => {
        path.extname = ".html";
      })
    )
    .pipe(gulp.dest("dist"));
});

gulp.task(
  "templates:optimized",
  gulp.series("templates", () =>
    gulp
      .src("./dist/**/*.html")
      .pipe(
        inlinesource({
          rootpath: `${process.cwd()}/dist`,
        })
      )
      .pipe(replace(/\.\.\//g, ""))
      .pipe(
        htmlmin({
          collapseWhitespace: true,
          removeComments: true,
        })
      )
      .pipe(gulp.dest("./dist/"))
  )
);

gulp.task("clean", (done) => del("./dist/", done));

gulp.task("watch", () => {
  gulp.watch(
    [
      "./src/templates/**/*.hbs",
      "./src/partials/**/*.hbs",
      "data.yml",
      "events.json",
      "Gulpfile.js",
    ],
    gulp.series("templates", "reload")
  );
  gulp.watch(["./src/sass/**/*.scss"], gulp.series("sass", "reload"));
  gulp.watch("./src/img/**/*", gulp.series("images", "reload"));
  gulp.watch(["./src/js/**/*.js", "Gulpfile.js"], gulp.series("js", "reload"));
});

gulp.task(
  "build",
  gulp.series(
    "clean",
    gulp.parallel("sass", "images", "fonts", "resources", "js", "templates")
  )
);

gulp.task(
  "build:optimized",
  gulp.series(
    "clean",
    gulp.parallel(
      "sass:optimized",
      "images:optimized",
      "fonts",
      "resources",
      "js",
      "templates:optimized"
    )
  )
);

gulp.task("deploy:rsync", (done) => {
  cp.exec("rsync -avuzh ./dist/* dan:/srv/example.com/public_html/", () => {
    process.stdout.write("Deployed to https://example.com\n");
    done();
  }).stdout.on("data", (data) => {
    process.stdout.write(data);
  });
});

gulp.task("deploy", gulp.series("build:optimized", "deploy:rsync"));

// use default task to launch Browsersync and watch JS files
gulp.task(
  "serve",
  gulp.series(
    "build",
    (done) => {
      // Serve files from the root of this project
      browserSync.init(["./dist/**/*"], {
        ghostMode: {
          clicks: false,
          forms: false,
          scroll: false,
        },
        server: {
          baseDir: "./dist",
        },
        notify: false,
      });

      done();
    },
    "watch"
  )
);
