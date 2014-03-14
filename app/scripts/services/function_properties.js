'use strict';

var client = angular.module('lelylan.directives.device.services.functions', [])

client.factory('DeviceFunction', ['Device', 'Utils', function(Device, Utils) {

  var service = {};

  service.setForms = function() {
    return null;
  }

  return service;
}]);
