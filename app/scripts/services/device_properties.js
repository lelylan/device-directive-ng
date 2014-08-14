'use strict';

var client = angular.module('lelylan.directives.device.services.properties', [])

client.factory('DeviceProperties', ['$rootScope', 'Device', 'Utils', function($rootScope, Device, Utils) {

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
   * Extend the device properties adding the name value (comes from the type)
   *
   *   DeviceProperties.extend(scope);
   */

  service.extend = function(scope) {
    _.each(scope.device.properties, function(property) {
      var resource = Utils.getResource(property.id, scope.type.properties);
      property.name = resource.name;
      property.type = resource.type;
    });
  }



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
   *
   * When the response is 200 (and 202) the request is propagated.
   * This happens when the physical uri is not set in the device.
   */

  service.sendProperties = function(scope, properties) {
    $rootScope.$broadcast('lelylan:device:properties:send', scope.device);

    Device.properties(scope.device.id, { properties: properties })
      .success(function(response, status) {
        scope.device = response;
        service.extend(scope);

        //if (status == 200)
        $rootScope.$broadcast('lelylan:device:update:set', scope.device);
      });
  }


  /*
   * Updates the device properties with the new values although
   * the success callback is not fired yet (optimistic).
   */

  service.optimisticProperties = function(scope, properties) {
    _.each(properties, function(resource) {
      var property = Utils.getResource(resource.id, scope.device.properties)
      scope.device.updated_at = new Date();
      property.pending  = true;
      property.expected = resource.expected;
      property.value    = resource.expected;
    });
  }


  return service;
}]);
