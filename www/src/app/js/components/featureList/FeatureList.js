/** @jsx React.DOM */

define([
  // libs
  'react',
  'lodash',
  // src
  'components/featureList/config',
  'analysis/WizardStore',
  'utils/GeoHelper'
], function (React, _, FeatureListConfig, WizardStore, GeoHelper) {

  var FeatureList,
    getDefaultState,
    KEYS = FeatureListConfig.STORE_KEYS,
    self = this;

  getDefaultState = function () {
    return {

    }
  }

  return React.createClass({

    propTypes: {
      features: React.PropTypes.array.isRequired
      // TODO: optional classes/styles
      // TODO: handle generic column registration w/ parent callback for events (rspo checkbox)
    },

    getInitialState: getDefaultState,

    render: function () {
      return (
        React.DOM.div(null, 
          React.DOM.button({className: "float-right margin__right"}, " Clear "), 
          React.DOM.div({className: "padding__wide"}, " FeatureList instruction "), 
          React.DOM.table({className: "no-border-spacing fill__wide"}, 
            React.DOM.tr({className: "text-white back-orange"}, 
              React.DOM.td(null, React.DOM.input({type: "checkbox", onClick: this._selectAllListFeatures})), 
              React.DOM.td(null, " Area Name ")
            ), 
            this.props.features.map(this._featuresMapper, this)
          )
        )
      );
    },

    _featuresMapper: function (feature, index) {
      var className = index % 2 === 0 ? 'back-light-gray' : ''
      return (
        React.DOM.tr({className: className, onClick: this._selectFeature}, 
          React.DOM.td(null, 
            React.DOM.input({type: "checkbox"})
          ), 
          React.DOM.td(null, 
            React.DOM.input({className: "custom-feature-label", type: "text", onChange: this._renameFeature, value: feature.attributes[FeatureListConfig.stepTwo.labelField], 'data-feature-index': index, 'data-feature-id': feature.attributes.WRI_ID})
          )
        )
      )
    },

    _removeFeature: function(evt) {
      var index = parseInt(evt.target.dataset ? evt.target.dataset.featureIndex : evt.target.getAttribute("data-feature-index")),
        spliceArgs = [index, 1]
        features = this.props.features,
        featureToRemove = Array.prototype.splice.apply(features, spliceArgs)[0];

      WizardStore.set(KEYS.customFeaturesSpliceArgs, spliceArgs);
      WizardStore.set(KEYS.customFeatures, features);
      return featureToRemove;
    },

    _renameFeature: function(evt) {
      var index = parseInt(evt.target.dataset ? evt.target.dataset.featureIndex : evt.target.getAttribute("data-feature-index")),
          features = WizardStore.get(KEYS.customFeatures);
      
      features[index].attributes[FeatureListConfig.stepTwo.labelField] = evt.target.value;

      WizardStore.set(KEYS.customFeatures, features);
      if (evt.target.parentNode.className.split(' ').indexOf('active') > -1) {
        WizardStore.set(KEYS.selectedCustomFeatures, feature);
      }
    },

    _selectFeature: function(evt) {
      console.log('TODO: FeatureList._selectFeature');
      // TODO: respect multiple feature selection, likely requires new store value to track
    },

    // TODO: replace chooseFeature with selectFeature respecting multiple feature selection
    _chooseFeature: function (evt) {
      var id = parseInt(evt.target.dataset ? evt.target.dataset.featureId : evt.target.getAttribute("data-feature-id")),
        features = this.props.features,
        featureToChoose = _.find(features, function(feature) {return feature.attributes.WRI_ID === id;}),
        self = this;

      if (featureToChoose) {
        GeoHelper.zoomToFeature(featureToChoose);
        WizardStore.set(KEYS.selectedCustomFeatures, featureToChoose);
      } else {
        throw new Error('Undefined Error: Could not find selected feature in WizardStore');
      }
    },

    _selectAllListFeatures: function () {
      console.log('TODO: FeatureList._selectAllListFeatures')
    }
  })
})
