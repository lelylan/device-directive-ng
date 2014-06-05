'use strict';

/*
 * Helper functions
 */

var client = angular.module('lelylan.directives.device.services.utils', [])

client.factory('Utils', function() {

  var service = {}


  /*
   * Gets the element identified by its ID
   *
   *   Utils.getResource(id, list)
   */

  service.getResource = function(id, resources) {
    return _.find(resources, function(resource) {
      return resource.id == id
    });
  }

  return service;
});
