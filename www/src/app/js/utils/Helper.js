define([
	"dojo/dom-class",
	"dojo/dom-geometry",
  "analysis/WizardHelper",
  "utils/AlertsHelper",
  "dojo/_base/window",
  "dojo/_base/connect",
  "dojo/_base/fx",
	"dojo/fx",
  "exports"
], function (domClass, domGeom, WizardHelper, AlertsHelper, win, connect, Fx, coreFx, exports) {
	'use strict';

  var _mapContainer,
      _getMapAnimation,
      ANIMATION_DURATION = 500,
      WIZARD_WIDTH = 460,
      self = this;

  _getMapAnimation = function (leftAnimationValue) {
    console.debug(leftAnimationValue);
    _mapContainer = _mapContainer || document.getElementById('map-container')
    return Fx.animateProperty({
      node:_mapContainer,
      properties: {
        left: leftAnimationValue
      },
      duration: ANIMATION_DURATION
    })
  }

	exports.enableLayout =  function () {
		var body = win.body(),
				width = domGeom.position(body).w;

		if (width < 960) {
			domClass.add(body, "mobile");
		}
	}

  exports.toggleWizard =  function () {
    var preAnimation;
    if (AlertsHelper.isOpen() === true) {
      preAnimation = coreFx.combine([AlertsHelper.toggleAlertsForm()].concat([_getMapAnimation(0)]));
      connect.connect(preAnimation, 'onEnd', function() {
        coreFx.combine(WizardHelper.toggleWizard().concat(_getMapAnimation(WizardHelper.isOpen() ? WIZARD_WIDTH : 0))).play();
      });
      preAnimation.play();
    } else {
      coreFx.combine(WizardHelper.toggleWizard().concat(_getMapAnimation(WizardHelper.isOpen() ? WIZARD_WIDTH : 0))).play();
    }
  }

  exports.toggleAlerts =  function () {
    var preAnimation;
    if (WizardHelper.isOpen() === true) {
      preAnimation = coreFx.combine(WizardHelper.toggleWizard().concat([_getMapAnimation(0)]));
      connect.connect(preAnimation, 'onEnd', function() {
        coreFx.combine([AlertsHelper.toggleAlertsForm(), _getMapAnimation(AlertsHelper.isOpen() ? 0 : WIZARD_WIDTH)]).play();
      });
      preAnimation.play();
    } else {
      coreFx.combine([AlertsHelper.toggleAlertsForm(), _getMapAnimation(AlertsHelper.isOpen() ? 0 : WIZARD_WIDTH)]).play();
    }
  }
});
