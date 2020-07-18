(function (global) {
  "use strict";

  function Sections(options) {
    var opts = options || {};

    this.settings = {
      bodyClassPrefix: opts.bodyClassPrefix || "in-section-",
      sectionClass: opts.sectionClass || "animated-section",
      mobileWidth: opts.mobileWidth || 640,
    };

    this.sectionElements = document.getElementsByClassName(
      this.settings.sectionClass
    );
    if (!this.sectionElements) {
      console.error(
        'Could not find any elements with the class "' +
          this.settings.sectionClass +
          '".'
      );
    }

    this.scrollingEnabled = false;
    this.lastWindowHeight = window.innerHeight;
    this.inRAF = false;
    this.shouldResize = false;
    this.lastYOffset = window.pageYOffset;
    this.sectionMap = this._computeSectionMap();
    this._onScroll();

    return this;
  }

  Sections.prototype._computeSectionMap = function () {
    var sectionMap = [];

    [].forEach.call(
      this.sectionElements,
      function (sectionElement) {
        sectionMap.push({
          element: sectionElement,
          begin: Math.max(
            sectionElement.offsetTop - this.lastWindowHeight / 2,
            0
          ),
          end:
            sectionElement.offsetTop -
            this.lastWindowHeight / 2 +
            sectionElement.clientHeight,
          sectionId: sectionElement.dataset.sectionId,
        });
      }.bind(this)
    );

    return sectionMap;
  };

  Sections.prototype._setBodySectionClass = function (newSectionClass) {
    var newBodyClassName = document.body.className;

    // Remove other section classes
    var re = new RegExp(this.settings.bodyClassPrefix + "[^ ]+ ", "g");
    newBodyClassName = newBodyClassName.replace(re, "");
    newBodyClassName = newBodyClassName.replace(/($ |[ ]+)/, " ");

    // Add new section class
    newBodyClassName += " " + newSectionClass + " ";

    // Set body class name
    document.body.className = newBodyClassName;
  };

  Sections.prototype._onScroll = function () {
    for (var i = 0; i < this.sectionMap.length; i++) {
      if (
        this.lastYOffset >= this.sectionMap[i].begin &&
        this.lastYOffset < this.sectionMap[i].end
      ) {
        var newSectionClass =
          this.settings.bodyClassPrefix + this.sectionMap[i].sectionId;
        this._setBodySectionClass(newSectionClass);
      }
    }

    this.inRAF = false;
  };

  Sections.prototype._getOnScroll = function () {
    var _this = this;

    var onScroll = function () {
      _this.lastYOffset = window.pageYOffset;

      // If we should resize, and entering the requestAnimationFrame would
      // cause us to set _this._inRAF = true and block from resizing, we should
      // just do a resize (which will itself call _this._onScroll).
      if (_this.shouldResize) {
        _this._onResize();
      } else if (!_this.inRAF) {
        _this.inRAF = true;
        window.requestAnimationFrame(_this._onScroll.bind(_this));
      }
    };

    return onScroll;
  };

  Sections.prototype._onResize = function () {
    if (
      this.scrollingEnabled &&
      window.innerWidth <= this.settings.mobileWidth
    ) {
      this._disableScrolling();
    } else if (
      !this.scrollingEnabled &&
      window.innerWidth > this.settings.mobileWidth
    ) {
      this._enableScrolling();
    }

    if (this.scrollingEnabled) {
      this.sectionMap = this._computeSectionMap();
      this._onScroll();
    }

    this.inRAF = false;
    this.shouldResize = false;
  };

  Sections.prototype._getOnResize = function () {
    var _this = this;

    var onResize = function () {
      _this.shouldResize = true;
      _this.lastWindowHeight = window.innerHeight;
      _this.lastYOffset = window.pageYOffset;

      if (!_this.inRAF) {
        _this.inRAF = true;
        window.requestAnimationFrame(_this._onResize.bind(_this));
      }
    };

    return onResize;
  };

  Sections.prototype._enableScrolling = function () {
    window.addEventListener("scroll", this.onScroll);
    this.scrollingEnabled = true;
    setTimeout(function () {
      document.body.className = document.body.className.replace(
        "is-mobile",
        ""
      );
    }, 400);
  };

  Sections.prototype._disableScrolling = function () {
    window.removeEventListener("scroll", this.onScroll);
    this.scrollingEnabled = false;
    this._setBodySectionClass("is-mobile");
  };

  Sections.prototype.enable = function () {
    this.onResize = this._getOnResize();
    this.onScroll = this._getOnScroll();
    window.addEventListener("resize", this.onResize);
    window.addEventListener("orientationchange", this.onResize);

    // Recompute our sectionMap once all of the images on the page have loaded.
    window.addEventListener("load", this.onResize);

    if (window.innerWidth > this.settings.mobileWidth) {
      this._enableScrolling();
    } else {
      this._disableScrolling();
    }
  };

  Sections.prototype.disable = function () {
    this._disableScrolling();
    window.removeEventListener("orientationchange", this.onResize);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("load", this.onResize);
  };

  if (typeof define === "function" && define.amd) {
    define(Sections);
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = Sections;
  } else {
    global.Sections = Sections;
  }
})(this);
