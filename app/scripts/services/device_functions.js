'use strict';

var client = angular.module('lelylan.directives.device.services.functions', [])

client.factory('DeviceFunction', ['Device', 'Utils', 'DeviceProperties', function(Device, Utils, DeviceProperties) {

  var service = {};


  /*
   * Set the form properties to be filled with the values of the device properties
   */

  service.setForms = function(scope) {
    scope.functions = angular.copy(scope.type.functions);
    _.each(scope.functions, function(_function) {
      service.setForm(_function, scope);
    });
  }


  /*
   * Execute the function.
   *
   * - if the function does not require a form to be filled directly updates the properties
   * - if the function form requires a form to be filled
   *   - if not visible, it becomes visible
   *   - if visible, it updates the properties and becomes hidden
   */

  service.execute = function(_function) {
    if (_function.toFill == false) {
      scope.updateProperties(_function.properties)
    } else {
      if (_function.visibleForm == true) {
        DeviceProperties.update(scope, _function.properties);
      }
      _function.visibleForm = !_function.visibleForm;
    }
  }



  /*
   * HELPERS
   */



  /*
   * Initialize function form
   */

  service.setForm = function(_function, scope) {
    service.setPropertiesToFill(_function);
    service.setFunctionToFill(_function);
    service.setExpectedProperties(_function, scope);
    service.extendFunctionProperties(_function, scope)
  }


  /*
   * Sets the properties that need to be filled from the user
   * (the ones with expected value set to null)
   */

  service.setPropertiesToFill = function(_function) {
    _.each(_function.properties, function(property) {
      property.toFill = (property.expected == null)
    });
  }


  /*
   * Sets the functions that need to be filled from the user
   * (true if one property needs to be filled)
   */

  service.setFunctionToFill = function(_function) {
    _function.toFill = _.reduce(_function.properties, function(result, property) {
      return result || property.toFill
    }, false);
  }


  /*
   * Sets the function property `expected` value to the one defined in the device propery.
   * This is done to give a consistent value to the user when the form is shown.
   * (we set only the values that vary from the user, as the others are predefined)
   */

  service.setExpectedProperties = function(_function, scope) {
    _.each(_function.properties, function(property) {
      if (property.toFill) {
        property.expected = Utils.getResource(property.id, scope.device.properties).expected;
      }
    });
  }


  /*
   * Extend the function property fields with the all the properties info defined in the type.
   * This is done to let the UI to define the best input form for the user.
   */

  service.extendFunctionProperties = function(_function, scope) {
    _.each(_function.properties, function(resource) {
      var property = Utils.getResource(resource.id, scope.type.properties);
      resource.type     = property.type;
      resource.range    = property.range;
      resource.accepted = property.accepted;
    });
  }


  return service;
}]);
