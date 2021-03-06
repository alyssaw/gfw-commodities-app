define([

    "map/config",
    "map/MapModel",
    "dojo/on",
    "dojo/dom",
    "dojo/query",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-style",
    "dijit/registry",
    "dojo/_base/array",
    "utils/Hasher",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/layers/RasterFunction",
    "esri/layers/LayerDrawingOptions"
], function(MapConfig, MapModel, on, dom, dojoQuery, topic, domClass, domStyle, registry, arrayUtils, Hasher, esriQuery, QueryTask, RasterFunction, LayerDrawingOptions) {

    return {

        // Called From Delegator or internally, layerConfig is in the Map Config
        // This function should only show or hide layers
        toggleLayers: function(layerConfig) {
            // The WDPA or pal layer has a helper layer it needs to manage
            // offload that functionality to a different function
            if (layerConfig.id === MapConfig.pal.id) {
                this.updateZoomDependentLayer(layerConfig, MapConfig.palHelper, 6);
                return;
            }

            if (layerConfig.id === MapConfig.gain.id) {
                this.updateZoomDependentLayer(layerConfig, MapConfig.gainHelper, 13);
                return;
            }

            // For the customSuitability Layer, It has to make a request to the server for a url for the image
            // and then load the image, show a loading wheel as this can be slow at times due to the double request
            if (layerConfig.id === MapConfig.suit.id) {
                this.showSuitabilityLoader();
            }

            var layer = app.map.getLayer(layerConfig.id);
            if (layer) {

                layer.setVisibility(!layer.visible);
                this.refreshLegendWidget();
            }
        },

        // Called From Delegator or internally, props is coming from a click event on the layer UI.
        // Can see the props in MapConfig.layerUI
        // This function should update dynamic layers but is called from checkboxes in the UI
        // and not radio buttons, which is why it has it's own function and cannot use updateDynamicLayer,
        // This queries other checkboxes in the same layer to find out which needs to be added to visible layers
        updateLayer: function(props) {
            var conf = MapConfig[props.key],
                layer = app.map.getLayer(conf.id),
                queryClass = props.filter,
                visibleLayers = [],
                itemLayer,
                itemConf;

            dojoQuery(".gfw .filter-list ." + queryClass).forEach(function(node) {
                itemLayer = node.dataset ? node.dataset.layer : node.getAttribute("data-layer");
                itemConf = MapConfig[itemLayer];
                if (itemConf) {
                    if (itemConf.id === layer.id && domClass.contains(node, "active")) {
                        visibleLayers.push(itemConf.layerId);
                    }
                }
            });

            if (layer) {
                if (visibleLayers.length > 0) {
                    layer.setVisibleLayers(visibleLayers);
                    layer.show();
                } else {
                    layer.hide();
                }
                this.refreshLegendWidget();
            }

        },
        // Called From Delegator or internally, layerConfig is in the Map Config
        // This function should only show layers

        showLayer: function(layerConfig) {
            var layer = app.map.getLayer(layerConfig.id);
            if (layerConfig.layerId !== undefined) {
                this.updateDynamicLayer(layerConfig);
                return;
            }

            if (layer) {
                if (!layer.visible) {
                    layer.show();
                    this.refreshLegendWidget();
                }
            }
        },

        // Called From Delegator or internally, layerConfig is in the Map Config
        // This function should only hide layers, helper for hiding children
        hideLayer: function(layerConfig) {
            var layer = app.map.getLayer(layerConfig.id);
            if (layer) {
                if (layer.visible) {
                    layer.hide();
                    this.refreshLegendWidget();
                }
            }
        },

        // Updates a dynamic layer controlled by a radio button so it simply changes the visible layers
        // to the one tied to the radio button, no need to have multiple sublayers turned on, if you do need 
        // that, look at updateLayer function instead or create a new one as that one is tied to the checkboxes
        updateDynamicLayer: function(layerConfig) {
            var layer = app.map.getLayer(layerConfig.id),
                visibleLayers = [];
            if (layer) {
                visibleLayers.push(layerConfig.layerId);
                layer.setVisibleLayers(visibleLayers);
                layer.show();
                this.refreshLegendWidget();
            }
        },

        setWizardDynamicLayerDefinition: function(config, filter) {
            var layer = app.map.getLayer(config.id),
                layerDefs = [],
                where;

            if (layer) {
                if (filter !== undefined) {
                    where = config.whereField + " = '" + filter + "'";
                    layerDefs[config.layerId] = where;
                    layer.setVisibleLayers([config.layerId], true);
                    layer.setLayerDefinitions(layerDefs);
                    layer.show();
                } else {
                    layer.hide();
                }
                this.refreshLegendWidget();
            }
        },

        setWizardMillPointsLayerDefinition: function(config) {
            // Option for Layer Definitions will come soon,
            // for now, just toggle the layer
            var layer = app.map.getLayer(config.id);
            if (layer) {
                if (layer.visible) {
                    layer.hide();
                } else {
                    layer.show();
                }
            }
        },

        setFiresLayerDefinition: function(filter, highConfidence) {
            var time = new Date(),
                layerDefs = [],
                visibleLayers,
                dateString,
                layer,
                where;

            layer = app.map.getLayer(MapConfig.fires.id);

            // 1*filter essentially casts as a number
            time.setDate(time.getDate() - (1 * filter));

            dateString = time.getFullYear() + "-" +
                (time.getMonth() + 1) + "-" +
                time.getDate() + " " + time.getHours() + ":" +
                time.getMinutes() + ":" + time.getSeconds();

            // Set up Layer defs based on the filter value, if filter = 7, just set where to 1 = 1
            where = (filter !== "7" ? "ACQ_DATE > date '" + dateString + "'" : "1 = 1");
            for (var i = 0, length = MapConfig.fires.defaultLayers.length; i < length; i++) {
                layerDefs[i] = where;
            }

            if (layer) {
                // Set up and update Visible Layers if they need to be updated
                visibleLayers = (highConfidence ? [0, 1] : [0, 1, 2, 3]);
                if (layer.visibleLayers.length !== visibleLayers.length) {
                    layer.setVisibleLayers(visibleLayers);
                }

                layer.setLayerDefinitions(layerDefs);
                this.refreshLegendWidget();
            }
        },

        setOverlaysVisibleLayers: function() {
            var visibleLayers = [],
                layer,
                key;

            // Layer Ids are in the config, the key to the config file is under the data-layer attribute of the elements
            dojoQuery(".gfw .overlays-container .overlays-checkbox.selected").forEach(function(node) {
                key = node.dataset ? node.dataset.layer : node.getAttribute("data-layer");
                visibleLayers.push(MapConfig[key].layerId);
            });

            layer = app.map.getLayer(MapConfig.overlays.id);
            if (layer) {
                if (visibleLayers.length === 0) {
                    visibleLayers.push(-1);
                    layer.hide();
                } else {
                    layer.show();
                }
                layer.setVisibleLayers(visibleLayers);
                this.refreshLegendWidget();
            }

        },

        updateImageServiceRasterFunction: function(values, layerConfig) {

            var layer = app.map.getLayer(layerConfig.id),
                rasterFunction,
                range;

            if (layer) {
                // Values in slider are from a 0 based index, the range starts at 1
                // so we need to shift the values by 1 to have correct range
                // Also the rule is [inclusive, exclusive], so if values are 3,3 use 3,3
                // if they are 3,4 then use 3,5
                range = values[0] === values[1] ? [values[0] + 1, values[1] + 1] : [values[0] + 1, values[1] + 2];
                rasterFunction = this.getSpecificRasterFunction(layerConfig.colormap, range);
                layer.setRenderingRule(rasterFunction);

            }


        },

        getSpecificRasterFunction: function(colormap, range) {
            return new RasterFunction({
                "rasterFunction": "Colormap",
                "rasterFunctionArguments": {
                    "Colormap": colormap,
                    "Raster": {
                        "rasterFunction": "Remap",
                        "rasterFunctionArguments": {
                            "InputRanges": range,
                            "OutputValues": [1],
                            "AllowUnmatched": false
                        }
                    }
                },
                "variableName": "Raster"
            });
        },

        updateCustomSuitabilityLayer: function(value, dispatcher) {

            var customLayer = app.map.getLayer(MapConfig.suit.id),
                settings = MapModel.get('suitabilitySettings'),
                activeCheckboxes = [];

            switch (dispatcher) {
                case 'peat-depth-slider':
                    settings.computeBinaryRaster[1].values = this._prepareSuitabilityJSON(0, value);
                    break;
                case 'conservation-area-slider':
                    settings.computeBinaryRaster[3].values = value;
                    break;
                case 'water-resource-slider':
                    settings.computeBinaryRaster[4].values = value;
                    break;
                case 'slope-slider':
                    settings.computeBinaryRaster[2].values = value;
                    break;
                case 'elevation-slider':
                    settings.computeBinaryRaster[5].values = value;
                    break;
                case 'rainfall-slider':
                    settings.computeBinaryRaster[6].values = parseInt(value[0]) + "," + parseInt(value[1]);
                    break;
                case 'soil-drainage-slider':
                    settings.computeBinaryRaster[7].values = this._prepareSuitabilityJSON(value[0], value[1], [99]);
                    break;
                case 'soil-depth-slider':
                    settings.computeBinaryRaster[8].values = this._prepareSuitabilityJSON(value, 7, [99]);
                    break;
                case 'soil-acid-slider':
                    settings.computeBinaryRaster[9].values = this._prepareSuitabilityJSON(value[0], value[1], [99]);
                    break;
                case 'landcover-checkbox':
                    // Push in all Active Checkboxes values
                    // Need to include Cloud as Suitable, its ID is 11
                    activeCheckboxes.push('11');
                    dojoQuery('#environmental-criteria .suitable-checkbox input:checked').forEach(function(node) {
                        activeCheckboxes.push(node.value);
                    });
                    settings.computeBinaryRaster[0].values = activeCheckboxes.join(",");
                    break;
                case 'soil-type-checkbox':
                    // Need to include default values to represent unknown values
                    activeCheckboxes.push('0');
                    activeCheckboxes.push('6');
                    // Push in all other Active Checkboxes values
                    dojoQuery('#environmental-criteria .suitable-checkbox-soil input:checked').forEach(function(node) {
                        activeCheckboxes.push(node.value);
                    });
                    //console.log("****************** soil type checkboxes: " + activeCheckboxes.toString());
                    settings.computeBinaryRaster[10].values = activeCheckboxes.join(",");
                    break;
            }


            MapModel.set('suitabilitySettings', settings);

            if (customLayer) {
                customLayer.refresh();
                this.showSuitabilityLoader();
            }

        },

        showSuitabilityLoader: function() {
            domClass.remove('suitability_loader', 'hidden');
        },

        hideSuitabilityLoader: function() {
            domClass.add('suitability_loader', 'hidden');
        },

        checkZoomDependentLayers: function(evt) {
            var protectedAreaConfig = MapConfig.pal,
                protectedAreaHelperConfig = MapConfig.palHelper,
                gainLayerConfig = MapConfig.gain,
                gainHelperConfig = MapConfig.gainHelper;

            this.toggleZoomDependentLayer(evt, protectedAreaConfig, protectedAreaHelperConfig, 6);
            this.toggleZoomDependentLayer(evt, gainLayerConfig, gainHelperConfig, 13);
        },

        toggleZoomDependentLayer: function(evt, tiledConfig, helperConfig, level) {
            var helperLayer,
                mainLayer;

            helperLayer = app.map.getLayer(helperConfig.id);
            mainLayer = app.map.getLayer(tiledConfig.id);

            if (mainLayer === undefined || helperLayer === undefined) {
                // Error Loading Layers and they do not work
                return;
            }

            if (!mainLayer.visible && !helperLayer.visible) {
                return;
            }

            if (app.map.getLevel() > level) {
                helperLayer.show();
                mainLayer.hide();
            } else {
                helperLayer.hide();
                mainLayer.show();
            }

        },

        updateZoomDependentLayer: function(layerConfig, helperConfig, level) {
            var helperLayer,
                mainLayer;

            helperLayer = app.map.getLayer(helperConfig.id);
            mainLayer = app.map.getLayer(layerConfig.id);

            if (mainLayer === undefined || helperLayer === undefined) {
                // Error Loading Layers and they do not work
                return;
            }

            if (mainLayer.visible || helperLayer.visible) {
                helperLayer.hide();
                mainLayer.hide();
            } else {
                if (app.map.getLevel() > level) {
                    helperLayer.show();
                } else {
                    mainLayer.show();
                }
            }

            this.refreshLegendWidget();

        },

        refreshLegendWidget: function() {
            var legendLayer = app.map.getLayer(MapConfig.legendLayer.id),
                densityConf = MapConfig.tcd,
                formaConf = MapConfig.forma,
                lossConf = MapConfig.loss,
                gainConf = MapConfig.gain,
                primForConf = MapConfig.primForest,
                suitConf = MapConfig.suit,
                confItems = [densityConf, formaConf, lossConf, gainConf, primForConf, suitConf],
                visibleLayers = [],
                layerOptions = [],
                layer,
                self = this;

            // Check Tree Cover Density, Tree Cover Loss, Tree Cover Gain, and FORMA Alerts visibility,
            // If they are visible, show them in the legend by adding their ids to visibleLayers.
            // Make sure to set layer drawing options for those values so they do not display 
            // over their ImageService counterparts

            ldos = new LayerDrawingOptions();
            ldos.transparency = 100;

            arrayUtils.forEach(confItems, function(item) {
                layer = app.map.getLayer(item.id);
                if (layer) {
                    if (layer.visible) {
                        visibleLayers.push(item.legendLayerId);
                        layerOptions[item.legendLayerId] = ldos;
                    }
                }
            });

            if (visibleLayers.length > 0) {
                legendLayer.setVisibleLayers(visibleLayers);
                legendLayer.setLayerDrawingOptions(layerOptions);
                if (!legendLayer.visible) {
                    legendLayer.show();
                }
            } else {
                legendLayer.hide();
            }
            registry.byId("legend").refresh();
        },

        changeLayerTransparency: function(layerConfig, layerType, transparency) {
            switch (layerType) {
                case "image":
                    this.setLayerOpacity(layerConfig, transparency);
                    break;
                case "dynamic":
                    this.setDynamicLayerTransparency(layerConfig, transparency);
                    break;
                case "tiled":
                    this.setLayerOpacity(layerConfig, transparency);
                    break;
            }
        },

        setLayerOpacity: function(layerConfig, transparency) {
            var layer = app.map.getLayer(layerConfig.id);
            if (layer) {
                layer.setOpacity(transparency / 100);
            } else {
                return;
            }
            // Protected Areas Layer has a helper dynamic layer to show closer then zoom level 6
            // So if we are setting transparency for Protected Areas, pass the helper config on to 
            // the Set Dynamic Layer Transparency function
            if (layer.id === 'ProtectedAreas') {
                this.setDynamicLayerTransparency(MapConfig.palHelper, transparency);
            }
            if (layer.id === 'Gain') {
                this.setLayerOpacity(MapConfig.gainHelper, transparency);
            }
        },

        setDynamicLayerTransparency: function(layerConfig, transparency) {
            var layer = app.map.getLayer(layerConfig.id),
                layerOptions,
                ldos;

            if (!layer) {
                // If the layer is invalid or missing, just return
                return;
            }

            ldos = new LayerDrawingOptions();
            // 100 is fully transparent, our sliders show 0 as transparent and 100 as opaque
            // Need to flip my transparency value around
            ldos.transparency = 100 - transparency;

            // If layer has layer drawing options, dont overwrite all of them, append to them or overwrite
            // only the relevant layer id
            layerOptions = layer.layerDrawingOptions || [];
            if (layerConfig.layerId !== undefined) {
                layerOptions[layerConfig.layerId] = ldos;

            } else if (layerConfig.defaultLayers) {
                arrayUtils.forEach(layerConfig.defaultLayers, function(layerId) {
                    layerOptions[layerId] = ldos;
                });
            }

            layer.setLayerDrawingOptions(layerOptions);

        },

        _prepareSuitabilityJSON: function(start, end, extraValues) {
            var result = [];
            for (var i = start; i <= end; i++) {
                result.push(i);
            }
            if (extraValues) {
                result = result.concat(extraValues);
            }
            return result.join(",");
        }

    };


});