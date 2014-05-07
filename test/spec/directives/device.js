// TODO move logics of the directive in a controller and make a test suite on it

'use strict';

describe('<device>', function() {

  var $rootScope, $compile, $location, $httpBackend, $scope, scope = {}, element;
  var DeviceFunction, DeviceProperties, DeviceStatuses;
  var device, type, privates;

  var compile = function($rootScope, $compile) {
    $scope = $rootScope;
    $compile(element)($scope);
    $scope.$digest();
  }

  beforeEach(module('lelylan.directives.device'));
  beforeEach(module('templates'));

  beforeEach(inject(function($injector) { $location        = $injector.get('$location') }));
  beforeEach(inject(function($injector) { $httpBackend     = $injector.get('$httpBackend') }));
  beforeEach(inject(function($injector) { $rootScope       = $injector.get('$rootScope') }));
  beforeEach(inject(function($injector) { $compile         = $injector.get('$compile') }));
  beforeEach(inject(function($injector) { DeviceProperties = $injector.get('DeviceProperties') }));
  beforeEach(inject(function($injector) { DeviceFunction   = $injector.get('DeviceFunction') }));
  beforeEach(inject(function($injector) { DeviceStatuses   = $injector.get('DeviceStatuses') }));

  beforeEach(function() {
    element = angular.element('<device device-id="1"></div>');
  });

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/test/spec/fixtures';
  });

  beforeEach(function() {
    device   = JSON.parse(readFixtures('device.json'));
    type     = JSON.parse(readFixtures('type.json'));
    privates = JSON.parse(readFixtures('privates.json'));
  });

  beforeEach(function() {
    $httpBackend.whenGET('http://api.lelylan.com/devices/1').respond(device);
    $httpBackend.whenGET('http://api.lelylan.com/types/1').respond(type);
    $httpBackend.whenGET('http://api.lelylan.com/devices/1/privates').respond(privates);
  });



  describe('when configures the directive', function() {

    beforeEach(function() {
      compile($rootScope, $compile);
    });

    beforeEach(function() {
      scope = element.scope().$$childTail;
    })

    it('sets view.paht to /loading', function() {
      expect(scope.view.path).toBe('/loading')
    });
  })



  describe('when sets the template', function() {

    describe('when the template is not defined', function() {

      beforeEach(function() {
        compile($rootScope, $compile);
      });

      beforeEach(function() {
        scope = element.scope().$$childTail;
      })

      it('sets the default template', function() {
        expect(scope.template).toBe('views/templates/default.html');
      });
    })

    describe('when the template is defined', function() {

      beforeEach(function() {
        $httpBackend.whenGET('/new.html').respond('');
      });

      beforeEach(function() {
        element = angular.element('<device device-id="1" template="/new.html"></div>');
      });

      beforeEach(function() {
        compile($rootScope, $compile);
      });

      beforeEach(function() {
        scope = element.scope().$$childTail;
      });

      it('sets the desired template', function() {
        expect(scope.template).toBe('/new.html');
      });
    });
  });



  describe('when calls the API', function() {

    describe('when GET /devices/:id', function() {

      it('makes the request', function() {
        $httpBackend.expect('GET', 'http://api.lelylan.com/devices/1');
        compile($rootScope, $compile);
        $httpBackend.flush();
      });

      it('sets scope.device', function() {
        compile($rootScope, $compile);
        scope = element.scope().$$childTail;
        $httpBackend.flush();
        expect(scope.device.name).toBe('Closet dimmer');
      });
    });

    describe('when GET /types/:id', function() {

      it('makes the request', function() {
        $httpBackend.expect('GET', 'http://api.lelylan.com/devices/1');
        compile($rootScope, $compile);
        $httpBackend.flush();
      });

      it('sets scope.type', function() {
        compile($rootScope, $compile);
        scope = element.scope().$$childTail;
        $httpBackend.flush();
        expect(scope.type.name).toBe('Dimmer');
      });
    });

    describe('when GET /devices/:id/privates', function() {

      it('makes the request', function() {
        $httpBackend.expect('GET', 'http://api.lelylan.com/devices/1/privates');
        compile($rootScope, $compile);
        $httpBackend.flush();
      });

      it('sets scope.private', function() {
        compile($rootScope, $compile);
        scope = element.scope().$$childTail;
        $httpBackend.flush();
        expect(scope.privates.secret).toBe('secret');
      });
    });

    describe('when all requests are resolved', function() {

      beforeEach(function() {
        compile($rootScope, $compile);
        $httpBackend.flush();
      })

      beforeEach(function() {
        scope = element.scope().$$childTail;
      })

      it('sets view.path to /default', function() {
        expect(scope.view.path).toBe('/default');
      });
    });
  });


  describe('#initialize', function() {

    beforeEach(function() {
      spyOn(DeviceFunction, 'setForm');
      spyOn(DeviceStatuses, 'set');
    });

    beforeEach(function() {
      compile($rootScope, $compile);
      $httpBackend.flush();
    });

    it('DeviceFunction#setForm', function() {
      expect(DeviceFunction.setForm).toHaveBeenCalled();
    });

    it('DeviceStatuses#set', function() {
      expect(DeviceStatuses.set).toHaveBeenCalled();
    });
  });


  describe('#execute', function() {

    beforeEach(function() {
      spyOn(DeviceFunction, 'execute');
    });

    beforeEach(function() {
      compile($rootScope, $compile);
      $httpBackend.flush();
    });

    beforeEach(function() {
      scope = element.scope().$$childTail;
    });

    beforeEach(function() {
      scope.execute(type.functions[0]);
    })

    it('DeviceFunction#execute', function() {
      expect(DeviceFunction.execute).toHaveBeenCalled();
    });
  });


  describe('#updateProperties', function() {

    beforeEach(function() {
      spyOn(DeviceProperties, 'update');
      spyOn(DeviceFunction, 'setForm');
      spyOn(DeviceStatuses, 'set');
    });

    beforeEach(function() {
      compile($rootScope, $compile);
      $httpBackend.flush();
    });

    beforeEach(function() {
      scope = element.scope().$$childTail;
    });

    beforeEach(function() {
      scope.updateProperties(type.functions[0].properties);
    })

    it('DeviceProperties#update', function() {
      expect(DeviceProperties.update).toHaveBeenCalled();
    });

    it('#initialize', function() {
      expect(DeviceFunction.setForm).toHaveBeenCalled();
      expect(DeviceStatuses.set).toHaveBeenCalled();
    });
  });


  describe('#destroy', function() {

    beforeEach(function() {
      $httpBackend.whenDELETE('http://api.lelylan.com/devices/1').respond(device);
    });

    // block needed to populate scope.device
    beforeEach(function() {
      compile($rootScope, $compile);
      scope = element.scope().$$childTail;
      $httpBackend.flush();
    });

    it('makes the request', function() {
      $httpBackend.expect('DELETE', 'http://api.lelylan.com/devices/1');
      scope.destroy()
      $httpBackend.flush();
    });
  });
});
