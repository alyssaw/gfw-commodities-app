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
      TEXT = FeatureListConfig.TEXT,
      KEYS = FeatureListConfig.STORE_KEYS,
      self = this;

  return React.createClass({

    propTypes: {
      features: React.PropTypes.array.isRequired,
      selectedFeatures: React.PropTypes.array.isRequired,
      rspoChecks: React.PropTypes.bool,
      showClear: React.PropTypes.bool
    },

    render: function () {
      var allFeaturesSelected = false,
          featureIds,
          selectedFeatureIds,
          allFeaturesSelected,
          allFeaturesRSPO,
          clearButton,
          rspoChecksHeader = '';

      if (this.props.selectedFeatures) {
        featureIds = this.props.features.map(this._featuresIdMapper);
        selectedFeatureIds = this.props.selectedFeatures.map(function (selectedFeature) {return selectedFeature.attributes.WRI_ID});
        allFeaturesSelected = featureIds.length > 0 && _.difference(featureIds, selectedFeatureIds).length === 0;
      }

      if (this.props.rspoChecks) {
        allFeaturesRSPO = this.props.features.length > 0 ? _.every(this.props.features, function (feature) {return feature.attributes.isRSPO === true}) : false;
        rspoChecksHeader = React.DOM.th(null, React.DOM.label(null, React.DOM.input({type: "checkbox", onChange: this._toggleAllFeaturesRSPO, checked: allFeaturesRSPO, disabled: this.props.features.length === 0}), TEXT.headers[2]));
      }

      if (this.props.selectedFeatures.length === 0 || (this.props.showClear !== undefined && this.props.showClear === false)) {
        clearButton = '';
      } else {
        clearButton = React.DOM.button({className: "button-link float-right margin__right no-padding__right", onClick: this._removeFeatureSelection}, TEXT.clear);
      }

      return (
        React.DOM.div({className: TEXT.className}, 
          clearButton, 
          React.DOM.div({className: "padding__wide margin__bottom"}, TEXT.instruction), 
          React.DOM.table({className: "no-border-spacing fill__wide border-box border-orange"}, 
            React.DOM.thead(null, 
              React.DOM.tr({className: "text-white text-center back-orange"}, 
                React.DOM.th(null, React.DOM.input({type: "checkbox", onChange: this._toggleAllFeaturesSelection, checked: allFeaturesSelected, disabled: this.props.features.length === 0})), 
                React.DOM.th(null, TEXT.headers[0]), 
                React.DOM.th(null, TEXT.headers[1]), 
                rspoChecksHeader
              )
            ), 
            React.DOM.tbody(null, 
              this._noFeatures(), 
              this.props.features.map(this._featuresMapper, this)
            )
          )
        )
      );
    },

    _featuresMapper: function (feature, index) {
      var isSelected = _.find(this.props.selectedFeatures, function (selectedFeature) { return feature.attributes.WRI_ID === selectedFeature.attributes.WRI_ID}) || false,
          className = index % 2 === 0 ? 'back-light-gray' : '',
          className = isSelected ? 'text-white back-medium-gray' : className,
          rspoChecks = this.props.rspoChecks ? React.DOM.td({className: "text-center"}, React.DOM.input({type: "checkbox", onChange: this._toggleFeatureRSPO, checked: feature.attributes.isRSPO, 'data-feature-id': feature.attributes.WRI_ID})) : '',
          typeIcon = feature.geometry.type === 'polygon' ? '/' : '.' ;

      return (
        React.DOM.tr({key: index, className: className}, 
          React.DOM.td({className: "text-center"}, 
            React.DOM.input({type: "checkbox", onChange: this._toggleFeatureSelection, checked: isSelected, 'data-feature-index': index, 'data-feature-id': feature.attributes.WRI_ID})
          ), 
          React.DOM.td({className: "text-center"}, 
            typeIcon
          ), 
          React.DOM.td(null, 
            React.DOM.input({className: "custom-feature-label text-inherit-color", type: "text", onChange: this._renameFeature, value: feature.attributes[FeatureListConfig.stepTwo.labelField], 'data-feature-index': index, 'data-feature-id': feature.attributes.WRI_ID})
          ), 
          rspoChecks
        )
      )
    },

    _noFeatures: function () {
      var colSpan = this.props.rspoChecks ? '4' : '3';

      if (this.props.features.length > 0) {
        return React.DOM.tr({className: "text-center"});
      }

      return (
        React.DOM.tr(null, 
          React.DOM.td({className: "text-center text-medium-gray", colSpan: colSpan}, React.DOM.i(null, TEXT.noAreas))
        )
      )
    },

    _toggleFeatureSelection: function (evt) {
      var index,
          id,
          filteredSelectedFeatures;

      if (evt.target.checked) {
        index = parseInt(evt.target.dataset ? evt.target.dataset.featureIndex : evt.target.getAttribute("data-feature-index"));
        filteredSelectedFeatures = this.props.selectedFeatures.concat(this.props.features[index]);
      } else {
        id = parseInt(evt.target.dataset ? evt.target.dataset.featureId : evt.target.getAttribute("data-feature-id")),
        filteredSelectedFeatures = _.filter(this.props.selectedFeatures, function (selectedFeature) { return selectedFeature.attributes.WRI_ID !== id })
      }

      WizardStore.set(KEYS.selectedCustomFeatures, filteredSelectedFeatures);
    },

    _toggleAllFeaturesSelection: function (evt) {
      var features = this.props.features,
          featureIds = features.map(this._featuresIdMapper),
          selectedFeatureIds,
          featuresToSelect,
          updatedSelectedFeatureIds;

      if (evt.target.checked) {
        selectedFeatureIds = this.props.selectedFeatures.map(this._featuresIdMapper),
        featuresToSelect = _.difference(featureIds, selectedFeatureIds).map(function (id) { return _.find(features, function (feature) {return feature.attributes.WRI_ID === id}) }),
        updatedSelectedFeatureIds = WizardStore.get(KEYS.selectedCustomFeatures).concat(featuresToSelect);
      } else {
        updatedSelectedFeatureIds = WizardStore.get(KEYS.selectedCustomFeatures).filter(function (feature) { return featureIds.indexOf(feature.attributes.WRI_ID) < 0 });
      }

      WizardStore.set(KEYS.selectedCustomFeatures, updatedSelectedFeatureIds);
    },

    _toggleAllFeaturesRSPO: function () {
      if (this.props.features.length === 0) {
        return;
      } 

      var feature,
          features = WizardStore.get(KEYS.customFeatures),
          featureIdsToUpdate = this.props.features.map(this._featuresIdMapper),
          allFeaturesRSPO = _.every(this.props.features, function (feature) {return feature.attributes.isRSPO === true}),
          shouldFeaturesRSPO = !allFeaturesRSPO;

      featureIdsToUpdate.forEach(function (id) {
        feature = _.find(features, function (feature) {return feature.attributes.WRI_ID === id});
        if (feature) {
          feature.attributes.isRSPO = shouldFeaturesRSPO;
        }
      });
      WizardStore.set(KEYS.customFeatures, features);
    },

    _toggleFeatureRSPO: function (evt) {
      var id = parseInt(evt.target.dataset ? evt.target.dataset.featureId : evt.target.getAttribute("data-feature-id")),
          features = WizardStore.get(KEYS.customFeatures),
          feature = _.find(features, function (feature) {return feature.attributes.WRI_ID === id});

      if (feature) {
        feature.attributes.isRSPO = !feature.attributes.isRSPO;
        WizardStore.set(KEYS.customFeatures, features);
      } else {
        throw new Error('Could not find feature to update rspo based on id');
      }
    },

    _removeFeatureSelection: function () {
      var featureIdsToRemove = this.props.selectedFeatures.map(this._featuresIdMapper),
          idsToRemoveFilter = function (feature) {return featureIdsToRemove.indexOf(feature.attributes.WRI_ID) < 0;},
          features = _.filter(WizardStore.get(KEYS.customFeatures), idsToRemoveFilter),
          selectedFeatures = _.filter(WizardStore.get(KEYS.selectedCustomFeatures), idsToRemoveFilter),
          removedFeatures = _.reject(WizardStore.get(KEYS.selectedCustomFeatures), idsToRemoveFilter);

      WizardStore.set(KEYS.removedCustomFeatures, removedFeatures);
      WizardStore.set(KEYS.customFeatures, features);
      WizardStore.set(KEYS.selectedCustomFeatures, selectedFeatures);
    },

    _renameFeature: function (evt) {
      var index = parseInt(evt.target.dataset ? evt.target.dataset.featureIndex : evt.target.getAttribute("data-feature-index")),
          features = WizardStore.get(KEYS.customFeatures);
      
      features[index].attributes[FeatureListConfig.stepTwo.labelField] = evt.target.value;

      WizardStore.set(KEYS.customFeatures, features);
      if (evt.target.parentNode.className.split(' ').indexOf('active') > -1) {
        WizardStore.set(KEYS.selectedCustomFeatures, feature);
      }
    },

    _featuresIdMapper: function(feature) {
      return feature.attributes.WRI_ID;
    }

  })
})
  
