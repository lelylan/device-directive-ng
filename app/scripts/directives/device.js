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
  'Profile',
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
    Profile,
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
      deviceTemplate: '@'
    }
  };

  definition.link = function(scope, element, attrs) {


    /*
     * CONFIGURATIONS
     */

    // active view
    scope.view = { path: '/loading' }

    // template
    scope.template = attrs.deviceTemplate || 'views/templates/default.html';

    // structure (statuses and functions) and typology (sensor or not)
    scope.hasStatuses  = true;
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
        Device.find(value).
          success(function(response) {
            scope.device = response;
            getType(response.type.id);
          }).
          error(function(data, status) {
            scope.view.path = '/message';
            scope.message = { title: 'Unauthorized Access', description: 'You have not the rights to access this device' }
          });
      }
    });


    /* whatches the device JSON and starts the loading phase and calls the type API */
    scope.$watch('deviceJson', function(value) {
      if (value) {
        value = JSON.parse(value);
        scope.device = value;
        getType(value.type.id);
      }
    });


    /* gets the type representation */
    var getType = function(id) {
      Type.find(id, { cache: true }).success(function(response) {
        scope.type = response;
        loadingCompleted();
      });
    }


    /* Gets the device privates info */
    var getPrivates = function(id) {
      if (scope.isMaker()) {
        Device.privates(id).
          success(function(response) {
            scope.privates = response;
          }).
          error(function(data, status) {
            scope.view.path = '/message';
            scope.message = { title: 'Unauthorized Access', description: 'You have not the rights to access this device' }
          });
      }
    }


    /* completes the loading phase and starts with the initialization */
    var loadingCompleted = function() {
      scope.visualization();
      scope.initialize();
      scope.view.path = '/default';
      $rootScope.$broadcast('lelylan:device:load', scope.device);
    }



    /*
     * FEATURES
     */

    /* Initialization */
    scope.initialize = function() {
      DeviceProperties.extend(scope);
      DeviceFunction.setForms(scope);
      DeviceStatuses.set(scope);
      scope.animate();
   };


    /* Full device or sensor visualization */
    scope.visualization = function() {
      scope.hasStatuses  = (scope.type.statuses.length  != 0)
      scope.hasFunctions = (scope.type.functions.length != 0)
    };


    /* Default device visualization */
    scope.showDefault = function() {
      scope.view.path='/default';
    }


    /* Settings visualization */
    scope.showSettings = function() {
      scope.deviceCopy = angular.copy(scope.device);
      scope.view.path  = '/settings';
      scope.privates = { secret: 'loading...' };
      getPrivates(scope.device.id);
    }


    /* Returns true if the logged user (if any) is the maker of the device */
    scope.isMaker = function() {
      return (Profile.get() && Profile.get().id == scope.device.maker.id);
    }


    /* Function execution */
    scope.execute = function(_function) {
      DeviceFunction.execute(_function, scope.updateProperties);
    };


    /* Properties update */
    scope.updateProperties = function(properties) {
      DeviceProperties.update(scope, properties);
      scope.initialize();
    }


    /* Device update */
    scope.update = function() {
      scope.view.path = '/default';
      Device.update(scope.device.id, scope.device).success(function(response) {
        scope.device = response;
        $rootScope.$broadcast('lelylan:device:update:set', response);
      });
    }


    /* Delete device */
    scope.destroy = function(confirm) {
      if (confirm == scope.device.name) {
        scope.view.path = '/message';
        scope.message = { title: 'Device deleted', description: 'Reload the page to update the view' }
        Device.delete(scope.device.id).success(function(response) {
          scope.device = response;
          $rootScope.$broadcast('lelylan:device:delete', response);
        });
      }
    }


    /* Form reset */
    scope.resetForm = function() {
      scope.device.name     = scope.deviceCopy.name;
      scope.device.physical = scope.deviceCopy.physical;
    }


    /*
     * Animate status change
     */

    scope.animate = function() {
      var effect = 'flipInX'; // fadeIn is a cleaner solution
      element.find('.ly-updated-animation').addClass('animated ' + effect);
      $timeout(function() { element.find('.ly-updated-animation').removeClass(effect); }, 500);
    }


    /*
     * Device opening event.
     * This event does not do anything but fires an open event that can be catched
     * to do some other stuff (like opening a detailed view).
     */

    scope.fire = function(event) {
      $rootScope.$broadcast('lelylan:device:custom:' + event, scope.device);
    }


    /*
     * Event listening for the device update.
     */

    scope.$on('lelylan:device:update:set', function(event, device) {
      if (scope.device.id == device.id) {
        scope.device = device;
        scope.initialize();
      }
    });

    /*
     * Updates the template at runtime
     */

    scope.$on('lelylan:device:template', function(event, data) {
      if (!data.id || data.id == scope.device.id) {
        scope.template = data.template;
        compile(scope);
      }
    });

  }

  return definition
}]);
