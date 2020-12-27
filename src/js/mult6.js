document.addEventListener('DOMContentLoaded', function () {
  var textElems = document.getElementsByClassName('stretch-to-mult');

  function stretchAsNeeded() {
    var i, naturalHeight, remainder;
    var rem = parseFloat(window.getComputedStyle(document.body).fontSize);
    for (i = 0; i < textElems.length; i++) {
      textElems[i].style.height = 'auto';
      naturalHeight = parseFloat(window.getComputedStyle(textElems[i]).height);
      remainder = naturalHeight % (6 * rem);
      if (remainder !== 0) {
        textElems[i].style.height = (naturalHeight + (6 * rem) - remainder) + "px";
      }
    }
  }

  window.addEventListener('resize', stretchAsNeeded);
  stretchAsNeeded();
});
