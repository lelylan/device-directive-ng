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

  definition.link = function(scope, element, attrs) {


    /*
     * CONFIGURATIONS
     */

    // active view
    scope.view = { path: '/loading' }

    // template setting
    scope.template = attrs.deviceTemplate || 'views/templates/default.html';

    // structure settings
    scope.hasStatus    = true;
    scope.hasFunctions = true;



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

    /* watches the device ID and gets the device representation and calls the type API */
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


    /* whatches the device JSON and starts the loading phase and calls the type API */
    scope.$watch('deviceJson', function(value) {
      if (value) {
        scope.device = value;
        getType(scope.device.type.id)
      }
    });


    /* gets the type representation */
    var getType = function(id) {
      Type.get({ id: id }).$promise.then(
        function(response) {
          scope.type = response;
          getPrivates(scope.device.id);
        }
      )
    }


    /* gets the device privates info */
    var getPrivates = function(id) {
      Device.privates({ id: id }).$promise.then(
        function(response) {
          scope.privates = response;
          loadingCompleted();
        }
      )
    }


    /* completes the loading phase and starts with the initialization */
    var loadingCompleted = function() {
      visualize();
      scope.initialize();
      scope.view.path = '/default';
    }



    /*
     * FEATURES
     */

    /* sensor or device visualization */
    var visualize = function() {
      scope.hasStatus    = (scope.type.statuses.length  != 0)
      scope.hasFunctions = (scope.type.functions.length != 0)
    };


    /* Initialization */
    scope.initialize = function() {
      DeviceProperties.extend(scope);
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
      scope.initialize();
    }


    /* Device update */
    scope.update = function() {
      scope.view.path = '/default';
      scope.device.$update();
    }

    /* Delete device */
    scope.destroy = function(confirm) {
      if (confirm == scope.device.name) {
        scope.view.path = '/message-deleted';
        scope.device.$delete()
      }
    }

  };

  return definition
}]);
