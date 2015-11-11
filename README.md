TITLE
========================================

TITLE is built using [Gulp][gulp], [Handlebars.js][handlebars], and [SCSS][scss].

## Setup

Install [npm][npm-install]. Then, install gulp:

```
npm install -g gulp  # May require `sudo`
```

## Developing

```
npm install
gem install scss_lint
gulp serve
```

## Gulp

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

### `gulp deploy`

For use by the Minimill team only.  Deploys to `work.minimill.co/TITLE/`, but won't do so without proper authentication.

## Structure

```
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

[browsersync]: http://www.browsersync.io/
[gulp]: http://gulpjs.com/
[handlebars]: http://handlebarsjs.com/
[npm-install]: https://nodejs.org/en/download/
[scss]: http://sass-lang.com/