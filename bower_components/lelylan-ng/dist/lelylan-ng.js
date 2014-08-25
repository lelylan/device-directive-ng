/* lelylan-ng - v0.2.0 - 2014-08-13 */

'use strict';

angular.module('lelylan.client', [
  'oauth',
  'lelylan.client.utils',
  'lelylan.client.category',
  'lelylan.client.device',
  'lelylan.client.activation',
  'lelylan.client.type',
  'lelylan.client.property',
  'lelylan.client.function',
  'lelylan.client.status',
  'lelylan.client.subscription'
]);

'use strict';

angular.module('lelylan.client').provider('lelylanClientConfig', function() {
  var config;

  config = { endpoint: 'http://api.lelylan.com' };

  return {

    configure: function(params) {
      return angular.extend(config, params);
    },

    $get: function() {
      return config;
    }
  }
});

'use strict';

var client = angular.module('lelylan.client.utils', []);

client.factory('LelylanClientUtils', ['AccessToken', function(AccessToken) {

  var service = {};

  service.headers = function() {
    return AccessToken.get() ? { Authorization: 'Bearer ' + AccessToken.get().access_token } : {}
  }

  service.merge = function(object1, object2) {
    for (var attrname in object2) { object1[attrname] = object2[attrname]; }
    return object1
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.activation', []);

client.factory('Activation', [
  '$http',
  'lelylanClientConfig',
  'LelylanClientUtils',

  function($http, config, Utils) {

  var service = {};
  var base = config.endpoint + '/activations';


  service.activate = function(params, _options) {
    var options = { headers: Utils.headers() };
    return $http.post(base, params, Utils.merge(options, _options));
  }

  service.deactivate = function(id, _options) {
    var options = { headers: Utils.headers() };
    return $http.delete(base + '/' + id, Utils.merge(options, _options));
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.category', []);

client.factory('Category', [
  '$http',
  'lelylanClientConfig',
  'LelylanClientUtils',

  function($http, config, Utils) {

  var service = {};
  var base = config.endpoint + '/categories';

  service.all = function(params, _options) {
    var options = { params: params, headers: Utils.headers() };
    return $http.get(base, Utils.merge(options, _options));
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.device', []);

client.factory('Device', [
  '$http',
  'lelylanClientConfig',
  'LelylanClientUtils',

  function($http, config, Utils) {

  var service = {};
  var base = config.endpoint + '/devices';


  service.find = function(id, _options) {
    var options = { headers: Utils.headers() };
    return $http.get(base + '/' + id, Utils.merge(options, _options));
  }

  service.all = function(params, _options) {
    var options = { params: params, headers: Utils.headers() };
    return $http.get(base, Utils.merge(options, _options));
  }

  service.privates = function(id, _options) {
    var options = { headers: Utils.headers() };
    return $http.get(base + '/' + id + '/privates', Utils.merge(options, _options));
  }

  service.create = function(params, _options) {
    var options = { headers: Utils.headers() };
    return $http.post(base, params, Utils.merge(options, _options));
  }

  service.update = function(id, params, _options) {
    var options = { headers: Utils.headers() };
    return $http.put(base + '/' + id, params, Utils.merge(options, _options));
  }

  service.delete = function(id, _options) {
    var options = { headers: Utils.headers() };
    return $http.delete(base + '/' + id, Utils.merge(options, _options));
  }

  service.properties = function(id, params, _options) {
    var options = { headers: Utils.headers() };
    return $http.put(base + '/' + id + '/properties', params, Utils.merge(options, _options));
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.function', []);

client.factory('Function', [
  '$http',
  'lelylanClientConfig',
  'LelylanClientUtils',

  function($http, config, Utils) {

  var service = {};
  var base = config.endpoint + '/functions';


  service.find = function(id, _options) {
    var options = { headers: Utils.headers() };
    return $http.get(base + '/' + id, Utils.merge(options, _options));
  }

  service.all = function(params, _options) {
    var options = { params: params, headers: Utils.headers() };
    return $http.get(base, Utils.merge(options, _options));
  }

  service.public = function(params, _options) {
    var options = { params: params };
    return $http.get(base + '/public', Utils.merge(options, _options));
  }

  service.create = function(params, _options) {
    var options = { headers: Utils.headers() };
    return $http.post(base, params, Utils.merge(options, _options));
  }

  service.update = function(id, params, _options) {
    var options = { headers: Utils.headers() };
    return $http.put(base + '/' + id, params, Utils.merge(options, _options));
  }

  service.delete = function(id, _options) {
    var options = { headers: Utils.headers() };
    return $http.delete(base + '/' + id, Utils.merge(options, _options));
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.property', []);

client.factory('Property', [
  '$http',
  'lelylanClientConfig',
  'LelylanClientUtils',

  function($http, config, Utils) {

  var service = {};
  var base = config.endpoint + '/properties';


  service.find = function(id, _options) {
    var options = { headers: Utils.headers() };
    return $http.get(base + '/' + id, Utils.merge(options, _options));
  }

  service.all = function(params, _options) {
    var options = { params: params, headers: Utils.headers() };
    return $http.get(base, Utils.merge(options, _options));
  }

  service.public = function(params, _options) {
    var options = { params: params };
    return $http.get(base + '/public', Utils.merge(options, _options));
  }

  service.create = function(params, _options) {
    var options = { headers: Utils.headers() };
    return $http.post(base, params, Utils.merge(options, _options));
  }

  service.update = function(id, params, _options) {
    var options = { headers: Utils.headers() };
    return $http.put(base + '/' + id, params, Utils.merge(options, _options));
  }

  service.delete = function(id, _options) {
    var options = { headers: Utils.headers() };
    return $http.delete(base + '/' + id, Utils.merge(options, _options));
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.status', []);

client.factory('Status', [
  '$http',
  'lelylanClientConfig',
  'LelylanClientUtils',

  function($http, config, Utils) {

  var service = {};
  var base = config.endpoint + '/statuses';


  service.find = function(id, _options) {
    var options = { headers: Utils.headers() };
    return $http.get(base + '/' + id, Utils.merge(options, _options));
  }

  service.all = function(params, _options) {
    var options = { params: params, headers: Utils.headers() };
    return $http.get(base, Utils.merge(options, _options));
  }

  service.public = function(params, _options) {
    var options = { params: params };
    return $http.get(base + '/public', Utils.merge(options, _options));
  }

  service.create = function(params, _options) {
    var options = { headers: Utils.headers() };
    return $http.post(base, params, Utils.merge(options, _options));
  }

  service.update = function(id, params, _options) {
    var options = { headers: Utils.headers() };
    return $http.put(base + '/' + id, params, Utils.merge(options, _options));
  }

  service.delete = function(id, _options) {
    var options = { headers: Utils.headers() };
    return $http.delete(base + '/' + id, Utils.merge(options, _options));
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.subscription', []);

client.factory('Subscription', ['$http', '$window', 'LelylanClientUtils', 'lelylanClientConfig', function($http, $window, Utils, config) {

  var service = {};
  var credentials = {};
  var base = config.endpoint + '/subscriptions';


  service.find = function(id, _options) {
    var options = { headers: headers() };
    return $http.get(base + '/' + id, Utils.merge(options, _options));
  }

  service.all = function(params, _options) {
    var options = { params: params, headers: headers() };
    return $http.get(base, Utils.merge(options, _options));
  }

  service.create = function(params, _options) {
    var options = { headers: headers() };
    return $http.post(base, params, Utils.merge(options, _options));
  }

  service.update = function(id, params, _options) {
    var options = { headers: headers() };
    return $http.put(base + '/' + id, params, Utils.merge(options, _options));
  }

  service.delete = function(id, _options) {
    var options = { headers: headers() };
    return $http.delete(base + '/' + id, Utils.merge(options, _options));
  }



  service.auth = function(params) {
    credentials = params;
  }

  var headers = function() {
    return { 'Authorization': 'Basic ' + encode(credentials) };
  }

  var encode = function(credentials) {
    return $window.btoa(credentials.clientId + ':' + credentials.clientSecret);
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.type', []);

client.factory('Type', [
  '$http',
  'lelylanClientConfig',
  'LelylanClientUtils',

  function($http, config, Utils) {

  var service = {};
  var base = config.endpoint + '/types';


  service.find = function(id, _options) {
    var options = { headers: Utils.headers() };
    return $http.get(base + '/' + id, Utils.merge(options, _options));
  }

  service.all = function(params, _options) {
    var options = { params: params, headers: Utils.headers() };
    return $http.get(base, Utils.merge(options, _options));
  }

  service.public = function(params, _options) {
    var options = { params: params };
    return $http.get(base + '/public', Utils.merge(options, _options));
  }

  service.popular = function(params, _options) {
    var options = { params: params };
    return $http.get(base + '/popular', Utils.merge(options, _options));
  }

  service.create = function(params, _options) {
    var options = { headers: Utils.headers() };
    return $http.post(base, params, Utils.merge(options, _options));
  }

  service.update = function(id, params, _options) {
    var options = { headers: Utils.headers() };
    return $http.put(base + '/' + id, params, Utils.merge(options, _options));
  }

  service.delete = function(id, _options) {
    var options = { headers: Utils.headers() };
    return $http.delete(base + '/' + id, Utils.merge(options, _options));
  }

  return service;
}]);
