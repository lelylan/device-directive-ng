'use strict';

describe('<device>', function() {

  var $location, $httpBackend, scope, element;

  beforeEach(module('lelylan.directives.device'));
  beforeEach(module('templates'));

  beforeEach(inject(function($injector) { $location    = $injector.get('$location') }));
  beforeEach(inject(function($injector) { $httpBackend = $injector.get('$httpBackend') }));

  beforeEach(inject(function($rootScope, $compile) {
    element = angular.element(
      '<device id="1"></div>'
    );
  }));

  var compile = function($rootScope, $compile) {
    scope = $rootScope;
    $compile(element)(scope);
    scope.$digest();
  }


  describe('when logged in', function() {

    beforeEach(function() {
      $httpBackend.whenGET('http://example.com/devices/1').respond({});
    });

    beforeEach(inject(function($rootScope, $compile) {
      compile($rootScope, $compile);
    }));

    it('shows the link "Logout #{profile.email}"', inject(function(Profile) {
      $httpBackend.flush();
    }));
  });
});
