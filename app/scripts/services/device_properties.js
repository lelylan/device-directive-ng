'use strict';

var client = angular.module('lelylan.directives.device.services.properties', [])

client.factory('DeviceProperties', ['Device', 'DeviceFunction', 'Utils', function(Device, DeviceFunction, Utils) {

  var service = {};


  /*
   * Updates the device properties (API) and reset the values of the functions form with
   * the updated values so that the next function execution contains the new values
   * to send to the server.
   *
   *   DeviceProperties.update(device, properties);
   */

  service.update = function(scope, functionProperties) {
    var properties = service.mapProperties(functionProperties);
    service.sendProperties(scope, properties);
    service.optimisticProperties(scope, properties);
    scope.device.pending = true;
  };



  /* * * * * *
   * Private *
   * * * * * */

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
   * Updates the device properties (API) and set the functions forms with the
   * new values. In this way, the next function execution will send the
   * correct values.
   */

  service.sendProperties = function(scope, properties) {
    var device = new Device({ id: scope.device.id, properties: properties});
    device.$properties({}, function() {
      scope.device = device;
      DeviceFunction.setForms();
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
