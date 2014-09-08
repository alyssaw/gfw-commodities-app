define([
	"dojo/topic",
	"map/config",
	"map/Controls",
	"analysis/Query",
	"analysis/Analyzer",
	"map/LayerController",
	"controllers/MapController",
	"controllers/ViewController"
], function (topic, MapConfig, Controls, AnalyzerQuery, Analyzer, LayerController, MapController, ViewController) {
	'use strict';

	return {

		startListening: function () {

			// View Controller Events
			topic.subscribe('changeView', function (newView) {
				ViewController.load(newView);
			});

			// Events coming from the Wizard
			topic.subscribe('setAdminBoundariesDefenition', function (filter) {
				LayerController.setAdminBoundariesLayerDefinition(filter);
				// If filter is none, dont zoom to none, above will turn layer off when none is selected
				if (filter) {
					AnalyzerQuery.zoomToBoundaries(filter);
				}
			});

			// Layer Controller Functions
			topic.subscribe('toggleLayer', function (layerId) {
				var config = MapConfig[layerId];
				if (config) {
					if (config.toolsNode) {
						// Show the opposite of the visible status, if the layer is visible, it is about to be turned off,
						// if the layer is not visible, it is about to be turned on
						var operation = app.map.getLayer(config.id).visible ? 'hide' : 'show';
						Controls.toggleToolbox(config, operation);
					}
					LayerController.toggleLayers(config);
				}
			});

			topic.subscribe('showLayer', function (layerId) {
				var config = MapConfig[layerId];
				if (config) {
					LayerController.showLayer(config);
					if (config.toolsNode) {
						Controls.toggleToolbox(config, 'show');
					}
				}
			});

			topic.subscribe('hideLayer', function (layerId) {
				var config = MapConfig[layerId];
				if (config) {
					LayerController.hideLayer(config);
					if (config.toolsNode) {
						Controls.toggleToolbox(config, 'hide');
					}
				}
			});

			topic.subscribe('updateLayer', function (props) {
				if (props.layerType === "tiled") {
					var config = MapConfig[props.key];
					if (config) {
						LayerController.toggleLayers(config);
					}
				} else if (props.layerType === "dynamic") {
					LayerController.updateLayer(props);
				}
			});

		}

	};

});