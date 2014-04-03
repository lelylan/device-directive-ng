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
     * CONFIGURATIONS
     */


    // activates the loading phase
    scope.loading = true;



    /*
     * PRELOADING
     */


    /*
     * Watches the device ID and starts loading all needed data
     */

    scope.$watch('deviceId', function(value) {
      if (value) {
        scope.device = Device.get({ id: value }, getType);
      }
    });

    /*
     * Whatches the device JSON and starts loading all needed data
     */

    scope.$watch('deviceJson', function(value) {
      if (value) {
        scope.device = value; getType()
      }
    });

    /*
     * gets the type representation
     */

    var getType = function() {
      scope.type = Type.get({ id: scope.device.type.id }, loadPrivates);
    };

    /*
     * gets the device privates info
     *
     * TODO call only when the private section is visible and the logged user
     *      is the connected user, otherwise skips it
     */
    var getPrivates = function() {
      scope.privates = Device.privates({ id: scope.device.id }), loaded;
    }

    /*
     * completes the loading phase and starts the initialization
     */
    var loaded = function() {
      initialize();
      scope.loading = false;
    }



    /*
     * Initialization
     */

    var initialize = function() {
      DeviceFunction.setForms();
      setDeviceStatus();
    };


    /*
     * Function execution
     */

    scope.execute = function(_function) {
      DeviceFunction.execute();
    };


    /*
     * Properties update
     */

    scope.updateProperties = function(properties) {
      DeviceProperties.update(scope, properties);
    }


    /*
     * Delete Device
     */

    scope.destroy = function() {
      scope.device.$delete()
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
  };

  return definition
}]);
