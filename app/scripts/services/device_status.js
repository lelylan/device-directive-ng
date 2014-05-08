/*
 * TODO total refactoring and new logics based on complex cases
 */

'use strict';

var client = angular.module('lelylan.directives.device.services.statuses', [])

client.factory('DeviceStatuses', ['Device', 'Utils', function(Device, Utils) {

  var service = {};


  /*
   * Finds the current status and save it into scope.status
   */

  service.set = function(scope) {
    scope.status = status; // to avoid errors on execute(status.function)
    _.each(scope.type.statuses, function(status) {
      if (service.checkStatus(status, scope.device)) {
        scope.status = status
        scope.status.function = Utils.getResource(status.function.id, scope.functions);
      }
    });
  }


  /*
   * Verify if all properties in a specific status matches with the current device properties.
   */

  service.checkStatus = function(status, device) {
    var passAll = []

    _.each(status.properties, function(statusProperty) {
      var property = Utils.getResource(statusProperty.id, device.properties);
      passAll.push(service.passProperty(property, statusProperty));
    });

    return _.every(passAll, _.identity);
  }


  /*
   * Verify if a single property in a specific status matches with the current device property.
   */

  service.passProperty = function(property, statusProperty) {
    var pass = true;
    pass = pass && service.checkPending(property, statusProperty);
    pass = pass && service.checkValues(property, statusProperty);
    pass = pass && service.checkRanges(property, statusProperty);
    return pass;
  }


  /*
   * Verify if the pending value is the same of the pending value defined in the status.
   */

  service.checkPending = function(property, statusProperty) {
    if (!statusProperty.pending) { return true }
    return (statusProperty.pending == property.pending) ? true : false
  }


  /*
   * Verify if the property value is into the values defined in the status.
   */

  service.checkValues = function(property, statusProperty) {
    if (statusProperty.values.length == 0) { return true }
    return (_.contains(statusProperty.values, property.value)) ? true : false
  }


  /*
   * Verify if the property value is into one of the range defined in the status.
   */

  service.checkRanges = function(property, statusProperty) {
    if (statusProperty.ranges.length == 0) { return true }

    var pass = false;
    _.each(statusProperty.ranges, function(range) {
      var value = parseInt(property.value);
      pass = pass || ((value >= range.min) && (value <= range.max))
    });

    return pass;
  }


  return service;
}]);
