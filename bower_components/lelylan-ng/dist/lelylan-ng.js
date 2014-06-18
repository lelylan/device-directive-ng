/* lelylan-ng - v0.1.0-beta.1 - 2014-05-17 */

'use strict';

angular.module('lelylan.client', [
  'oauth',
  'lelylan.client.config',
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

angular.module('lelylan.client.config', [])
  .value('lelylan.client.config', { endpoint: 'http://api.lelylan.com' });

'use strict';


/* Sets and clears the access token used during the API requests */

angular.module('lelylan.client').run(function($rootScope, $http) {
  $rootScope.$on('oauth2:login', function(event, token) {
    $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
  });

  $rootScope.$on('oauth2:logout', function(event) {
    delete $http.defaults.headers.common.Authorization;
  });

  $rootScope.$on('oauth2:denied', function(event) {
    delete $http.defaults.headers.common.Authorization;
  });
});


'use strict';

var client = angular.module('lelylan.client.activation', []);

client.factory('Activation', ['$http', 'lelylan.client.config', function($http, config) {

  var service = {};
  var base = config.endpoint + '/activations';


  service.activate = function(params) {
    return $http.post(base, params);
  }

  service.deactivate = function(id) {
    return $http.delete(base + '/' + id);
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.category', []);

client.factory('Category', ['$http', 'lelylan.client.config', function($http, config) {

  var service = {};
  var base = config.endpoint + '/categories';

  service.all = function(params) {
    return $http.get(base, { params: params });
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.device', []);

client.factory('Device', ['$http', 'lelylan.client.config', function($http, config) {

  var service = {};
  var base = config.endpoint + '/devices';


  service.find = function(id) {
    return $http.get(base + '/' + id);
  }

  service.all = function(params) {
    return $http.get(base, { params: params });
  }

  service.privates = function(id) {
    return $http.get(base + '/' + id + '/privates');
  }

  service.create = function(params) {
    return $http.post(base, params);
  }

  service.update = function(id, params) {
    return $http.put(base + '/' + id, params);
  }

  service.delete = function(id) {
    return $http.delete(base + '/' + id);
  }

  service.properties = function(id, params) {
    return $http.put(base + '/' + id + '/properties', params);
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.function', []);

client.factory('Function', ['$http', 'lelylan.client.config', function($http, config) {

  var service = {};
  var base = config.endpoint + '/functions';


  service.find = function(id) {
    return $http.get(base + '/' + id);
  }

  service.all = function(params) {
    return $http.get(base, { params: params });
  }

  service.public = function(params) {
    return $http.get(base + '/public', { params: params });
  }

  service.create = function(params) {
    return $http.post(base, params);
  }

  service.update = function(id, params) {
    return $http.put(base + '/' + id, params);
  }

  service.delete = function(id) {
    return $http.delete(base + '/' + id);
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.property', []);

client.factory('Property', ['$http', 'lelylan.client.config', function($http, config) {

  var service = {};
  var base = config.endpoint + '/properties';


  service.find = function(id) {
    return $http.get(base + '/' + id);
  }

  service.all = function(params) {
    return $http.get(base, { params: params });
  }

  service.public = function(params) {
    return $http.get(base + '/public', { params: params });
  }

  service.create = function(params) {
    return $http.post(base, params);
  }

  service.update = function(id, params) {
    return $http.put(base + '/' + id, params);
  }

  service.delete = function(id) {
    return $http.delete(base + '/' + id);
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.status', []);

client.factory('Status', ['$http', 'lelylan.client.config', function($http, config) {

  var service = {};
  var base = config.endpoint + '/statuses';


  service.find = function(id) {
    return $http.get(base + '/' + id);
  }

  service.all = function(params) {
    return $http.get(base, { params: params });
  }

  service.public = function(params) {
    return $http.get(base + '/public', { params: params });
  }

  service.create = function(params) {
    return $http.post(base, params);
  }

  service.update = function(id, params) {
    return $http.put(base + '/' + id, params);
  }

  service.delete = function(id) {
    return $http.delete(base + '/' + id);
  }

  return service;
}]);

'use strict';

var client = angular.module('lelylan.client.subscription', []);

client.factory('Subscription', ['$http', '$window', 'lelylan.client.config', function($http, $window, config) {

  var service = {};
  var credentials = {};
  var base = config.endpoint + '/subscriptions';


  service.find = function(id) {
    return $http.get(base + '/' + id, { headers: headers() });
  }

  service.all = function(params) {
    return $http.get(base, { params: params, headers: headers() });
  }

  service.create = function(params) {
    return $http.post(base, params, { headers: headers() });
  }

  service.update = function(id, params) {
    return $http.put(base + '/' + id, params, { headers: headers() });
  }

  service.delete = function(id) {
    return $http.delete(base + '/' + id, { headers: headers() });
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

client.factory('Type', ['$http', 'lelylan.client.config', function($http, config) {

  var service = {};
  var base = config.endpoint + '/types';


  service.find = function(id) {
    return $http.get(base + '/' + id);
  }

  service.all = function(params) {
    return $http.get(base, { params: params });
  }

  service.public = function(params) {
    return $http.get(base + '/public', { params: params });
  }

  service.create = function(params) {
    return $http.post(base, params);
  }

  service.update = function(id, params) {
    return $http.put(base + '/' + id, params);
  }

  service.delete = function(id) {
    return $http.delete(base + '/' + id);
  }

  return service;
}]);
