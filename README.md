Project Template
========================================

#### _Because web development doesn't need to be a pain._

The [Minimill](https://minimill.co) project template is the best way to build static sites fast.  With one command, build a static page using [Gulp][gulp], [Jekyll][jekyll], and [SCSS][scss].

_Other Versions: [ES6](https://github.com/minimill/project-template/tree/es6), [Minimill internal](https://github.com/minimill/project-template/tree/minimill)_

## Features

- Install the project in just three commands (see "Developing" below).
- Use [Jekyll][jekyll] for content management and templating.
- Use [ImageMagick][imagemagick] to resize images for responsive / retina loading.
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

Install [yarn][yarn-install]. Then, install gulp:

```bash
yarn global add gulp  # May require `sudo`
```

Finally, install [ImageMagick][imagemagick]. You have done so successfully if you can run 

```bash
convert -help
```

without any errors.

## Usage

### Developing

```bash
yarn                   # One time
bundle install         # One time
gulp serve
```

### A Note on Directory Structure and Compilation

Because Gulp and Jekyll to not play nice historically, static assets need to be generated into two different folders:

* SCSS source files live in `_scss/` and compile to both  `css/` and `_site/css/` 
* JavaScript source files live in `_js/` and compile to both  `js/` and `_site/js/`
* Images in `_img/` compile to both  `img/` and `_site/img/`

> **Note:** the root level `css/`, `js/`, and `img/` folders are in the `.gitignore` and are regularly deleted.  **Modifications to these folders may be lost without warning!** Instead, edit source files in the corresponding underscore-prefixed folders.

### Responsive Images

This workflow allows you to use progressive, responsive images with ease. This means that with a single line of code, you can include an image that both loads with a blur-into-focus placeholder and loads an appropriately sized image for your device.

#### Instructions

1.  Place images that you wish to resize into the `/_img/res/raw` folder.
2.  To resize them, run

    ```bash
    gulp responsive
    ```

    > This will create subdirectories within the `/_img/res/` folder with resized images in each.  By default, it creates the folders `20/`, `400/`, `800/`, and `1600/`, with images resized to those heights in pixels in each one. Then, these images will be copied into `/_site/img/res/<size>` for static access. In addition, data about these images (filename / aspect ratio pairs, and generated sizes) is generated into `/_data/responsiveMetatdata.json`.

3.  Use the Jeyll include to insert your image!

    ```html
    {% include resimg.html src="example-image.jpg" %}
    ```
    
4.  (Optional) Use the included image viewer by adding the class `with-viewer`:

    ```html
    {% include resimg.html src="example-image.jpg" class="with-viewer" %}
    ```

5.  (Optional) Customize what size images are generated by changing the `responsiveSizes` variable at the top of `Gulpfile.js`.

> **Note:** By default, responsive resizing is not included in the `gulp serve` command, as it can be very computationally expensive. This can be enabled by uncommenting `['responsive']` in the `images` and `images:optimized` tasks.

> **Note:** By default, generated images and `/_data/responsiveMetadata.json` are included in the `.gitignore`.

## Reminders

If you want to use this repo for your next project, make sure to make the following changes:

1. Edit `_config.yml`, filling in the HTML metadata associated with your site.
2. Edit `package.json` providing a `name`, `version`, `description`, `license`, and `repository.url`.
3. Remove the `.git` folder, so that you start from a fresh commit history.
4. Edit `LICENSE.md` and `README.md` to your preference.
5. Remove `.gitkeep` files that are placeholders for your content.

## Gulp Commands

An overview of Gulp commands available:

### `gulp build`

Builds the site into the `dist` directory.  This includes:

- SCSS w/ linting, sourcemaps and autoprefixing
- JS linting and uglification
- Image optimization and resizing

### `gulp build:optimized`

This is used for distributing an optimized version of the site (for deployment).  It includes everything from `gulp build` as well as:
- SCSS minification
- CSS / JS inline-sourcing 
- more rigorous image optimization

### `gulp responsive`

Resizes images in the `_img/res/raw` directory into `_img/res/<size>` directories, for several different heights in pixels (default: 20, 400, 800, 1600).

### `gulp watch`

Watchs for changes in local files and rebuilds parts of the site as necessary, into the `dist` directory.

### `gulp serve`

Runs `gulp watch` in the background, and serves the `dist` directory at `localhost:3000` with automatic reloading using [Browsersync][browsersync].

## Structure

```bash
├── _img/             # All images that will be hosted statically.
    └── res/          # Responsive images
        ├── 20/       # 20px tall images
        ├── 400/      # 400px tall images
        ├── ...       # ...
        └── raw/      # Full size images
├── _includes/        # Jekyll HTML includes
├── _js/              # JavaScript libraries and scripts, pre-compilation
├── _layouts/         # Jekyll HTML layouts
├── _posts/           # Jekyll HTML/Markdown posts
├── _scss/            # Stylesheets, pre-compliation
├── _site/            # GENERATED Jekyll builds the site into this directory
├── css/              # GENERATED Gulp builds SCSS into this directory
├── js/               # GENERATED Gulp builds JS into this directory
├── img/              # GENERATED Gulp builds images into this directory
├── node_modules/     # GENERATED NPM installs JS modules here.
├── _config.yml       # Metadata associated with the site.
├── Gulpfile.js       # Controls Gulp, used for building the website
├── index.html        # The root HTML file for the website
├── LICENSE.md        # This project's license
├── package.json      # Dependencies
└── README.md         # This file
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
[jekyll]: https://jekyllrb.com/
[imagemagick]: http://www.imagemagick.org/script/index.php
