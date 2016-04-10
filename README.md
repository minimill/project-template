Project Template
========================================

#### _Because web development doesn't need to be a pain._

The [Minimill](https://minimill.co) project template is the best way to build static sites fast.  With one command, build a static page using [Gulp][gulp], [Handlebars.js][handlebars], and [SCSS][scss].

_Other Versions: [ES6](https://github.com/minimill/project-template/tree/es6), [Minimill internal](https://github.com/minimill/project-template/tree/minimill)_

## Features

- Install the project in just three commands (see "Developing" below).
- Use [Handlebars.js][handlebars] to keep our HTML organized into templates and partials.
- Use [SCSS][scss] to keep our CSS organized into logical components.
- Use [Autoprefixer][autoprefixer] to automatically insert browser prefixes where necessary to handle cross browser compatibility.
- Use [Browsersync][browsersync] to automatically launch a development version of our website, reload the page whenever we change the HTML, and inject changes to CSS, JavaScript, and images with needing to reload.
- Use [HTML Minifier][htmlmin], [CSSNano][cssnano], [UglifyJS][uglifyjs], and [ImageMin][imagemin] to compress and optimize our HTML, CSS, JavaScript, and images, respectively.
- Use [SCSS-Lint][scss-lint], [JSHint][jshint], and [JSCS][jscs] to perform [linting][linting] and style checking on our SCSS and JavaScript files.

All with one command from the terminal:

```bash
gulp serve
```

## Setup

Install [npm][npm-install]. Then, install gulp:

```bash
npm install -g gulp  # May require `sudo`
```

## Developing

```bash
npm install            # One time
gem install scss_lint  # One time
gulp serve
```

## Reminders

If you want to use this repo for your next project, make sure to make the following changes:

1. Edit `data.yml`, filling in the HTML metadata associated with your site.
2. Edit `package.json` providing a `name`, `version`, `description`, `license`, and `repository.url`.
3. Remove the `.git` folder, so that you start from a fresh commit history.
4. Edit `LICENSE.md` and `README.md` to your preference.

## Gulp Commands

An overview of Gulp commands available:

### `gulp build`

Builds the site into the `dist` directory.  This includes:

- SCSS w/ linting, sourcemaps and autoprefixing
- JS linting and uglification
- Handlebars to HTML

### `gulp build:optimized`

This is used for distributing an optimized version of the site (for deployment).  It includes everything from `gulp build` as well as:
- SCSS minification
- CSS / JS inline-sourcing 

### `gulp watch`

Watchs for changes in local files and rebuilds parts of the site as necessary, into the `dist` directory.

### `gulp serve`

Runs `gulp watch` in the background, and serves the `dist` directory at `localhost:3000` with automatic reloading using [Browsersync][browsersync].

## Structure

```bash
├── Gulpfile.js       # Controls Gulp, used for building the website
├── README.md         # This file
├── data.yml          # Metadata associated with the site.
├── dist/             # Gulp builds the static site into this directory
├── package.json      # Dependencies
└── src/              # All source code
    ├── font/         # Font files
    ├── img/          # Images and SVGs
    ├── js/           # Javascript libraries and scripts
    ├── partials/     # Handlebars HTML partials that are included / extended
    ├── sass/         # Stylesheets
    └── templates/    # Handlebars HTML files, one per page on the site.
```

[autoprefixer]: https://css-tricks.com/autoprefixer/
[browsersync]: http://www.browsersync.io/
[cssnano]: http://cssnano.co/
[gulp]: http://gulpjs.com/
[handlebars]: http://handlebarsjs.com/
[htmlmin]: https://github.com/kangax/html-minifier
[imagemin]: https://github.com/imagemin/imagemin
[jscs]: http://jscs.info/
[jshint]: http://jshint.com/
[linting]: https://en.wikipedia.org/wiki/Lint_%28software%29
[npm-install]: https://nodejs.org/en/download/
[uglifyjs]: https://github.com/mishoo/UglifyJS
[scss]: http://sass-lang.com/
[scss-lint]: https://github.com/brigade/scss-lint
