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
    _.each(statuses, function(status) {
      if (checkStatus(status, scope.device)) { scope.status = status }
    });
  }


  /*
   * Verify if the status matches with the current device properties.
   */

  service.checkStatus = function(status, device) {
    var passAll = []

    _.each(status.properties, function(statusProperty) {
      var property = Utils.getResource(statusProperty.id, device.properties);
      passAll.push(service.passProperty(property, statusProperty));
    });

    return _.every(passAll, _.identity);
  }

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
