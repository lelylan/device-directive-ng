// TODO move logics of the directive in a controller and make a test suite on it

'use strict';

describe('<device>', function() {

  var $rootScope, $compile, $location, $httpBackend, $scope, scope = {}, element;

  beforeEach(module('lelylan.directives.device'));
  beforeEach(module('templates'));

  beforeEach(inject(function($injector) { $location    = $injector.get('$location') }));
  beforeEach(inject(function($injector) { $httpBackend = $injector.get('$httpBackend') }));
  beforeEach(inject(function($injector) { $rootScope   = $injector.get('$rootScope') }));
  beforeEach(inject(function($injector) { $compile     = $injector.get('$compile') }));

  // fixtures
  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/test/spec/fixtures';
    scope.device = JSON.parse(readFixtures('device.json'));
    scope.type = JSON.parse(readFixtures('type.json'));
  });

  // compile
  beforeEach(inject(function($rootScope, $compile) {
    element = angular.element('<device device-id="1"></div>');
  }));

  var compile = function($rootScope, $compile) {
    $scope = $rootScope;
    $compile(element)($scope);
    $scope.$digest();
  }


  describe('when makes the API requests', function() {

    beforeEach(function() {
      $httpBackend.whenGET('http://api.lelylan.com/devices/1').respond(scope.device);
      $httpBackend.whenGET('http://api.lelylan.com/types/1').respond(scope.device);
    });

    it('GET /devices/:id', function() {
      $httpBackend.expect('GET', 'http://api.lelylan.com/devices/1');
      compile($rootScope, $compile);
      $httpBackend.flush();
    });

    it('GET /types/:id', function() {
      $httpBackend.expect('GET', 'http://api.lelylan.com/types/1');
      compile($rootScope, $compile);
      $httpBackend.flush();
    });




    //describe('when checks the pending status', function() {

      //beforeEach(function() {
        //compile($rootScope, $compile);
        //$httpBackend.flush();
        //scope = element.scope().$$childTail
      //})

      //it('sets the final pending to false', function() {
        //expect(scope.loading).toBe(false);
      //});
    //});
  });
});
