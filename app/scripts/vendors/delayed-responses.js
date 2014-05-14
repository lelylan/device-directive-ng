// Delay mock responses from $httpBackend
app.config(function($provide) {
  $provide.decorator('$httpBackend', function($delegate) {
    var proxy = function(method, url, data, callback, headers) {
      var interceptor = function() {
        var _this = this,
        _arguments = arguments;
        setTimeout(function() {
          callback.apply(_this, _arguments);
        }, 1000);
      };
      return $delegate.call(this, method, url, data, interceptor, headers);
    };
    for(var key in $delegate) {
      proxy[key] = $delegate[key];
    }
    return proxy;
  });
});
