/**
 * Helper function for dynamically loading external scripts.
 *
 * @param      {String}    url     Script URL.
 * @param      {Function}  fn      Callback function.
 */
module.exports = function loadScript(url, fn) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  if (script.readyState) {
    // IE
    script.onreadystatechange = function() {
      if (script.readyState in ['loaded', 'complete']) {
        script.onreadystatechange = null;
        fn();
      }
    };
  } else {
    // Others
    script.onload = function() {
      fn();
    };
  }
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
};
