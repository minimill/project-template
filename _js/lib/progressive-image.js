(function(global) {
  'use strict';

  /**
   * Find the CSS transition end event that we should listen for.
   *
   * @returns {string} t - the transition string
   */
  function _whichTransitionEndEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      MSTransition: 'msTransitionEnd',
      OTransition: 'otransitionend',
      transition: 'transitionend',
    };
    for (t in transitions) {
      if (transitions.hasOwnProperty(t)) {
        if (el.style[t] !== undefined) {
          return transitions[t];
        }
      }
    }
  }

  /**
   * This class manages a single image. It keeps track of the image's height,
   * width, and position in the grid. An instance of this class is associated
   * with a single image figure, which looks like this:
   *
   *   <figure class="progressive-image"
   *       data-small="..."
   *       data-medium="..."
   *       data-large="...">
   *     <div class="aspect-ratio-holder" style="padding-bottom: ..."></div>
   *     <img class="thumbnail" src="..." alt="...">
   *   </figure>
   *
   * @param {element} figure - the <figure> DOM element.
   * @returns {object} the progressive image object
   */
  function ProgressiveImage(figure) {
    this.figure = figure;
    this.lastWindowWidth = window.innerWidth;
    this.viewerOpen = false;
    this.transitionEndEvent = _whichTransitionEndEvent();
    this.load();
    if (this.figure.className.indexOf('viewer') >= 0) {
      this.figure.addEventListener('click', this.openViewer.bind(this));
    }
    return this;
  }

  ProgressiveImage.prototype.closeViewer = function() {
    window.removeEventListener('scroll', this.onScroll);
    this.figure.addEventListener(this.transitionEndEvent, function() {
      if (document.body.className.indexOf('viewer-open') == -1) {
        this.viewerOpen = false;
        this.figure.style.zIndex = '';
      }
    }.bind(this));

    // Begin transition
    document.body.className = document.body.className.replace('viewer-open', '').replace(/^\s+|\s+$/g, '');
    this.figure.style.transform = '';
  };

  ProgressiveImage.prototype.openViewer = function() {
    if (document.body.className.indexOf('viewer-open') >= 0) {
      this.closeViewer();
      return;
    }

    this.viewerOpen = true;


    // Initial Values
    var figureStyle = window.getComputedStyle(this.figure);
    var initialHeight = parseFloat(figureStyle.height);
    var initialWidth = parseFloat(figureStyle.width);
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    var figureBoundingRect = this.figure.getBoundingClientRect();

    // Computed Values
    var figureAspectRatio = initialWidth / initialHeight;
    var windowAspectRatio = windowWidth / windowHeight;
    var scale, translateX, translateY;

    if (windowAspectRatio >= figureAspectRatio) {
      // Image will fill up vertical space
      scale = windowHeight / initialHeight;
      var finalWidth = initialWidth * scale;
      translateX = (windowWidth - finalWidth) / 2 - figureBoundingRect.left;
      translateY = figureBoundingRect.top * -1;

    } else {
      // Image will fill up horizontal space
      scale = windowWidth / initialWidth;
      var finalHeight = initialHeight * scale;
      translateY = (windowHeight - finalHeight) / 2 - figureBoundingRect.top;
      translateX = figureBoundingRect.left * -1;
    }

    // Apply DOM transformations
    document.body.className += ' viewer-open';
    this.figure.style.zIndex = '800';
    this.figure.style.transform = 'translate3d(' + translateX + 'px,' + translateY + 'px,0) scale(' + scale + ')';

    // Load Raw Image (large!)
    setTimeout(function() {
      if (this.lastWindowWidth < 1440) {
        // There is a larger image to load.
        this.loadRaw();
      }
    }.bind(this), 300);

    this.onScroll = function() {
      var offset = this.figure.getBoundingClientRect().top;
      if (Math.abs(offset) > 50) {
        this.closeViewer();
      }
    }.bind(this);
    window.addEventListener('scroll', this.onScroll);
  };

  /**
   * Load the full image element into the DOM.
   */
  ProgressiveImage.prototype.load = function() {
    // Create a new image element, and insert it into the DOM.
    var fullImage = new Image();
    fullImage.src = this.figure.dataset[this.getSize()];
    fullImage.className = 'full';
    fullImage.onload = function() {
      this.figure.className += ' loaded';
    }.bind(this);

    this.figure.appendChild(fullImage);
  };

  /**
   * Load the raw image element into the DOM.
   */
  ProgressiveImage.prototype.loadRaw = function() {
    // Create a new image element, and insert it into the DOM.
    var rawImage = new Image();
    // not actually raw, because damn, that's expensive.
    rawImage.src = this.figure.dataset.large;
    rawImage.className = 'raw';
    rawImage.onload = function() {
      this.figure.className += ' loaded-raw';
    }.bind(this);

    this.figure.appendChild(rawImage);
  };

  /**
   * Choose the size of image to load based on the window width.
   */
  ProgressiveImage.prototype.getSize = function() {
    if (this.lastWindowWidth < 768) {
      return 'small';
    } else if (this.lastWindowWidth < 1440) {
      return 'medium';
    } else {
      return 'large';
    }
  };

  // Export ProgressiveImage into the global scope.
  if (typeof define === 'function' && define.amd) {
    define(ProgressiveImage);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressiveImage;
  } else {
    global.ProgressiveImage = ProgressiveImage;
  }

}(this));
