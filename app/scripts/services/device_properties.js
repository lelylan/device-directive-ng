'use strict';

var client = angular.module('lelylan.directives.device.services.properties', [])

client.factory('DeviceProperties', ['Device', 'Utils', function(Device, Utils) {

  var service = {};


  /*
   * Updates the device properties (API) and calls the function to reset the values of the
   * functions form with the updated values. In this way the next function execution will
   * contain the updated values to send to the server.
   *
   *   DeviceProperties.update(scope, properties);
   */

  service.update = function(scope, functionProperties) {
    var properties = service.mapProperties(functionProperties);
    service.sendProperties(scope, properties);
    service.optimisticProperties(scope, properties);
    scope.device.pending = true;
  };



  /*
   * HELPERS
   */



  /*
   * Returns all fields needed to update the device properties
   */

  service.mapProperties = function(properties) {

    return _.map(properties, function(property) {
      return {
        id: property.id,
        pending: property.pending,
        expected: property.expected
      }
    });
  }


  /*
   * Updates the device properties (API).
   */

  service.sendProperties = function(scope, properties) {
    var device = new Device({ id: scope.device.id, properties: properties});
    device.$properties({}, function() {
      scope.device = device;
    });
  }


  /*
   * Updates the device properties with the new values although
   * the success callback is not fired yet (optimistic).
   */

  service.optimisticProperties = function(scope, properties) {
    _.each(properties, function(resource) {
      var property = Utils.getResource(resource.id, scope.device.properties)
      property.pending  = resource.pending;
      property.expected = resource.expected;
    });
  }


  return service;
}]);
