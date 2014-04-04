/*
* TODO call only when the private section is visible and the logged user
*      is the connected user, otherwise skips it
*/

'use strict';

angular.module('lelylan.directives.device.directive', [])

angular.module('lelylan.directives.device.directive').directive('device', [
  '$rootScope',
  '$timeout',
  '$compile',
  '$templateCache',
  '$http',
  'Device',
  'Type',
  'DeviceProperties',
  'DeviceFunction',
  'DeviceStatuses',

  function(
    $rootScope,
    $timeout,
    $compile,
    $templateCache,
    $http,
    Device,
    Type,
    DeviceProperties,
    DeviceFunction,
    DeviceStatuses
  ) {


  var definition = {
    restrict: 'EA',
    replace: true,
    scope: {
      deviceId: '@',
      deviceJson: '@',
      deviceType: '@',
      deviceTemplate: '@'
    }
  };

  // TODO try to remove the name of the funciton postLink
  definition.link = function postLink(scope, element, attrs) {


    /*
     * CONFIGURATIONS
     */


    // activates the loading phase
    scope.loading = true;

    // template setting
    scope.template = attrs.template || 'views/templates/default.html'



    /*
     * DYNAMIC LAYOUT
     */

    var compile = function() {
      $http.get(scope.template, { cache: $templateCache }).success(function(html) {
        element.html(html);
        $compile(element.contents())(scope);
      });
    }

    compile();


    /*
     * API REQUESTS
     */


    /* watches the device ID and starts loading all needed data */
    scope.$watch('deviceId', function(value) {
      if (value) {
        Device.get({ id: value }).$promise.then(
          function(response) {
            scope.device = response;
            getType(scope.device.type.id);
          }
        )
      }
    });


    /* whatches the device JSON and starts loading all needed data */
    scope.$watch('deviceJson', function(value) {
      if (value) {
        scope.device = value;
        getType()
      }
    });


    /* gets the type representation */
    var getType = function(id) {
      Type.get({ id: id }).$promise.then(
        function(response) {
          scope.type = response;
          //loadPrivates();
        }
      )
    };


    /* gets the device privates info */
    var getPrivates = function() {
      scope.privates = Device.privates({ id: scope.device.id }), loaded;
    }


    /* completes the loading phase and starts the initialization */
    var loaded = function() {
      initialize();
      scope.loading = false;
    }



    /*
     * FEATURES
     */

    /* Initialization */
    var initialize = function() {
      DeviceFunction.setForms(scope);
      DeviceStatuses.set(scope);
    };


    /* Function execution */
    scope.execute = function(_function) {
      DeviceFunction.execute(_function);
    };


    /* Properties update */
    scope.updateProperties = function(properties) {
      DeviceProperties.update(scope, properties);
      initialize();
    }


    /* Delete device */
    scope.destroy = function() {
      scope.device.$delete()
    }
  };

  return definition
}]);
