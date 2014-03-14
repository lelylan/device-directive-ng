'use strict';

angular.module('lelylan.directives.device.directive', [])

angular.module('lelylan.directives.device.directive').directive('device', ['$rootScope', '$timeout', 'Utils', 'Device', 'Type',
  function($rootScope, $timeout, Utils, Device, Type) {

  var definition = {
    restrict: 'EA',
    replace: true,
    scope: {
      deviceId: '@',
      deviceJson: '@',
      deviceType: '@',
      deviceView: '@',
      deviceMenu: '@',
    }
  };

  definition.link = function postLink(scope, element, attrs) {



    /*
     * Configurations
     */

    // Starts the loading phase
    scope.loading = true;



    /*
     * Watchers
     */

    scope.$watch('deviceId', function(value) {
      if (value) { scope.device = Device.get({ id: value }, getType); }
    });

    scope.$watch('deviceJson', function(value) {
      if (value) { scope.device = value; getType() }
    });



    /*
     * Initialization
     */

    // Component initialization.
    var getType = function() {
      scope.type = Type.get({ id: scope.device.type.id }, initialize);
    };

    var initialize = function() {
      // Gets the private device info
      getPrivates();
      // Sets the function forms logics
      setFunctionsForms();
      // get the actual device status
      setDeviceStatus();
      // complete the loading phase
      scope.loading = false;
    };



    /*
     * Get private device data representation
     */

    var getPrivates = function() {
      scope.privates = Device.privates({ id: scope.device.id });
    }



    /*
     * Functions form definition
     *
     * Sets the function forms that will be shown asking for required properties
     * to the user (the form is shown when property values are missing).
     */

    // Extends the type functions properties injecting the device value
    var setFunctionsForms = function() {

      // copy all functions to not update the type resource
      scope.functions = angular.copy(scope.type.functions);

      _.each(scope.functions, function(_function) {

        // sets the properties that need to be filled from the user (the ones without expected value) - setPropertiesToFill()
        _.each(_function.properties, function(property) { property.toFill = (property.expected == null) });

        // sets the functions that need to be filled from the user (if at least one property needs to be filled) - setFormsToFill()
        _function.toFill = _.reduce(_function.properties, function(result, property) { return result || property.toFill; }, false);

        // sets the function property `expected` taking it from the device properties when the value needs
        // to be is asked to the user. This is done to show to the user the actual property value - setExpected()
        _.each(_function.properties, function(property) {
          if (property.toFill)
            property.expected = Utils.getResource(property.id, scope.device.properties).expected;
        });

        // sets the type property fields into the function properties to let the UI to build the
        // correct input fields that will be shown to the user - extendFunctionProperties()
        _.each(_function.properties, function(resource) {
          property = Utils.getResource(resource.id, scope.type.properties);
          resource.type     = property.type;
          resource.range    = property.range;
          resource.accepted = property.accepted;
        });

      });
    }



    /*
     * Function execution
     *
     * - if the function requires a form to be filled we toggle it
     * - if the function does not require a form to be filled we update the properties
     */

    scope.execute = function(_function) {
      (_function.toFill) ? _function.show = !_function.show : scope.updateProperties(_function.properties)
    };



    /*
     * Properties update
     */

    scope.updateProperties = function(properties) {

      // filters the properties we need to sent to the API
      properties = filterUpdateProperties(properties);

      // makes the request to Lelylan and once it's done returns the device
      // representation and initialize the form values
      var device = new Device({ id: scope.device.id, properties: properties});
      device.$properties({}, function() {
        scope.device = device;
        setFunctionsForms();
      });

      // optimistic update of the device properties waiting for the final values
      _.each(scope.device.properties, function(resource) {
        property = Utils.getResource(resource.id, properties)
        resource.pending  = property.pending;
        resource.expected = property.expected;
      });

      scope.device.pending = true;
    };


    // Filter the property fields that needs to be sent to Lelylan
    var filterUpdateProperties = function(properties) {
      return _.map(properties, function(property) {
        return {
          id: property.id,
          pending: property.pending,
          expected: property.expected
        }
      });
    }



    /*
     * Device status definition
     */

    var setDeviceStatus = function() {
      scope.status = { }
      _.each(scope.type.statuses, function(status) {
        _.each(status.properties, function(property) {
          var list   = property.values;
          var object = Utils.getResource(property.id, scope.device.properties).expected;
          if (_.contains(list, object)) {
            scope.status = status;
            scope.status.function = Utils.getResource(scope.status.function.id, scope.functions);
          }
        });
      });
    };



    /*
     * Delete Device
     */

    scope.destroy = function() {
      scope.device.$delete()
    }

  };

  return definition
}]);
