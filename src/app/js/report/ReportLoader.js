/* global window, document, location */
// ENV to dev for Development, pro for Production
(function(win, doc) {
  'use strict';

  var src = [
    'http://js.arcgis.com/3.10/',
    'http://code.jquery.com/jquery-1.11.0.min.js'
  ],
  css = [
    'http://js.arcgis.com/3.10/js/esri/css/esri.css',
    '../../css/report.css'
  ],
  URL = location.pathname.replace(/app\/js\/report.*/, '') + 'app',
  dojoConfig = {
    parseOnLoad: false,
    isDebug: false,
    async: true,
    packages: [{
      name: 'libs',
      location: URL + '/libs'
    }, {
      name: 'report',
      location: URL + '/js/report'
    }],
    aliases: [
      ["knockout", "libs/knockout-3.1.0"],
      ["dom-style", "dojo/dom-style"],
      ["dom-class", "dojo/dom-class"],
      ["topic", "dojo/topic"],
      ["dom", "dojo/dom"],
      ["on", "dojo/on"]
    ],
    deps: [
      'dojo/domReady!'
    ],
    callback: function() {
      require([
        "report/Generator"
      ], function (Generator) {
        Generator.init();
      });
    }
  }; // End dojoConfig

  var loadScript = function(src, attrs) {
    var s = doc.createElement('script');
    s.setAttribute('src', src);
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        s.setAttribute(key, attrs[key]);
      }
    }
    doc.getElementsByTagName('body')[0].appendChild(s);
  };

  var loadStyle = function(src) {
    var l = doc.createElement('link');
    l.setAttribute('rel', 'stylesheet');
    l.setAttribute('type', 'text/css');
    l.setAttribute('href', src);
    doc.getElementsByTagName('head')[0].appendChild(l);
  };

  function loadDependencies() {
    // Load Esri Dependencies
    win.dojoConfig = dojoConfig;
    for (var i = 0, len = css.length; i < len; i++) {
      loadStyle(css[i]);
    }
    for (var j = 0, size = src.length; j < size; j++) {
      loadScript(src[j]);
    }
  }

  win.requestAnimationFrame = (function() {
    return win.requestAnimationFrame ||
      win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame ||
      win.oRequestAnimationFrame ||
      win.msRequestAnimationFrame;
  })();

  if (win.requestAnimationFrame) {
    win.requestAnimationFrame(loadDependencies);
  } else if (doc.readyState === "loaded") {
    loadDependencies();
  } else {
    win.onload = loadDependencies;
  }

})(window, document);