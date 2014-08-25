/* device-directive-ng - v0.2.3 - 2014-08-25 */

'use strict';

angular.module('lelylan.directives.device', [
  'lelylan.client',
  'lelylan.directives.device.services.properties',
  'lelylan.directives.device.services.functions',
  'lelylan.directives.device.services.statuses',
  'lelylan.directives.device.services.utils',
  'lelylan.directives.device.directive',
  'ngTouch',
  'ngAnimate',
  'angularMoment'
]);

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

'use strict';

var client = angular.module('lelylan.directives.device.services.functions', [])

client.factory('DeviceFunction', ['Utils', function(Utils) {

  var service = {};


  /*
   * Set the form properties to be filled with the values of the device properties
   */

  service.setForms = function(scope) {
    scope.functions = angular.copy(scope.type.functions);
    _.each(scope.functions, function(_function) {
      service.setForm(_function, scope);
    });
  }


  /*
   * Execute the function.
   *
   * - if the function does not require a form to be filled directly updates the properties
   * - if the function form requires a form to be filled
   *   - if not visible, it becomes visible
   *   - if visible, it updates the properties and becomes hidden
   */

  service.execute = function(_function, callback) {
    if (_function ) {
      if (_function.toFill == false) {
        callback(_function.properties)
      } else {
        if (_function.visibleForm == true)
          callback(_function.properties);
        _function.visibleForm = !_function.visibleForm;
      }
    }
  }



  /*
   * HELPERS
   */



  /*
   * Initialize function form
   */

  service.setForm = function(_function, scope) {
    service.setPropertiesToFill(_function);
    service.setFunctionToFill(_function);
    service.setExpectedProperties(_function, scope);
    service.extendFunctionProperties(_function, scope);
    service.setNumberValuesToInt(_function, scope);
  }


  /*
   * Sets the properties that need to be filled from the user
   * (the ones with expected value set to null)
   */

  service.setPropertiesToFill = function(_function) {
    _.each(_function.properties, function(property) {
      property.toFill = (property.expected == null)
    });
  }


  /*
   * Sets the functions that need to be filled from the user
   * (true if one property needs to be filled)
   */

  service.setFunctionToFill = function(_function) {
    _function.toFill = _.reduce(_function.properties, function(result, property) {
      return result || property.toFill
    }, false);
  }


  /*
   * Sets the function property `expected` value to the one defined in the device propery.
   * This is done to give a consistent value to the user when the form is shown.
   * (we set only the values that vary from the user, as the others are predefined)
   */

  service.setExpectedProperties = function(_function, scope) {
    _.each(_function.properties, function(property) {
      if (property.toFill) {
        property.expected = Utils.getResource(property.id, scope.device.properties).expected;
      }
    });
  }


  /*
   * Extend the function property fields with the all the properties info defined in the type.
   * This is done to let the UI to define the best input form for the user.
   */

  service.extendFunctionProperties = function(_function, scope) {
    _.each(_function.properties, function(resource) {
      var property = Utils.getResource(resource.id, scope.type.properties);
      resource.name     = property.name;
      resource.type     = property.type;
      resource.range    = property.range;
      resource.accepted = property.accepted;
    });
  }

  service.setNumberValuesToInt = function(_function, scope) {
    _.each(_function.properties, function(property) {
      if (property.type == 'number')
        property.expected = parseFloat(property.expected);
    });
  }


  return service;
}]);

/*
 * TODO total refactoring and new logics based on complex cases
 */

'use strict';

var client = angular.module('lelylan.directives.device.services.statuses', [])

client.factory('DeviceStatuses', ['Utils', function(Utils) {

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
    return (_.contains(statusProperty.values, property.expected)) ? true : false
  }


  /*
   * Verify if the property value is into one of the range defined in the status.
   */

  service.checkRanges = function(property, statusProperty) {
    statusProperty.ranges = statusProperty.ranges || [];
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
    scope.template = attrs.deviceTemplate || 'bower_components/device-directive-ng/dist/views/templates/default.html';

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

      if (!scope.privates) {
        getPrivates(scope.device.id);
      }
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
