// TODO move logics of the directive in a controller and make a test suite on it

'use strict';

describe('<device>', function() {

  var $rootScope, $compile, $location, $timeout, $httpBackend, $scope, scope = {}, element;
  var Profile, DeviceFunction, DeviceProperties, DeviceStatuses;
  var device, type, privates;
  var callback;

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
  beforeEach(inject(function($injector) { $timeout         = $injector.get('$timeout') }));
  beforeEach(inject(function($injector) { Profile          = $injector.get('Profile') }));
  beforeEach(inject(function($injector) { DeviceProperties = $injector.get('DeviceProperties') }));
  beforeEach(inject(function($injector) { DeviceFunction   = $injector.get('DeviceFunction') }));
  beforeEach(inject(function($injector) { DeviceStatuses   = $injector.get('DeviceStatuses') }));
  beforeEach(inject(function($injector) { callback         = jasmine.createSpy('callback') }));

  beforeEach(function() {
    element = angular.element('<device device-id="1"></div>');
  });

  beforeEach(function() {
    jasmine.getFixtures().fixturesPath = 'base/test/spec/fixtures';
  });



  describe('when sensor', function() {

    beforeEach(function() {
      device = JSON.parse(readFixtures('device-sensor.json'));
      type   = JSON.parse(readFixtures('type-sensor.json'));
    });

    beforeEach(function() {
      $httpBackend.whenGET('http://api.lelylan.com/devices/1').respond(device);
      $httpBackend.whenGET('http://api.lelylan.com/types/1').respond(type);
      $httpBackend.whenGET('http://api.lelylan.com/devices/1/privates').respond(privates);
    });

    describe('when all requests are resolved', function() {

      beforeEach(function() {
        compile($rootScope, $compile);
        $httpBackend.flush();
      })

      beforeEach(function() {
        scope = element.scope().$$childTail;
      })

      it('sets scope.hasStatuses to false', function() {
        expect(scope.hasStatuses).toBe(false);
      });

      it('sets scope.hasFunctions to false', function() {
        expect(scope.hasFunctions).toBe(false);
      });
    });
  });



  describe('when not sensor', function() {

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



    describe('when configuring', function() {

      beforeEach(function() {
        compile($rootScope, $compile);
      });

      beforeEach(function() {
        scope = element.scope().$$childTail;
      });

      it('sets view.path to /loading', function() {
        expect(scope.view.path).toBe('/loading')
      });
    });



    describe('when sets the template', function() {

      describe('with no settings', function() {

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

      describe('with device-template', function() {

        beforeEach(function() {
          $httpBackend.whenGET('/new.html').respond('<div>Example</div>');
        });

        beforeEach(function() {
          element = angular.element('<device device-id="1" device-template="/new.html"></div>');
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

        it('sets the new HTML', function() {
          $httpBackend.flush();
          expect(element.text()).toBe('Example')
        });
      });

      describe('with template event', function() {

        describe('when targets all devices', function() {

          beforeEach(function() {
            compile($rootScope, $compile);
          });

          beforeEach(function() {
            scope = element.scope().$$childTail;
          });

          beforeEach(function() {
            $httpBackend.flush();
          });

          beforeEach(function() {
            $rootScope.$broadcast('lelylan:device:template', { template: 'views/templates/new.html' });
            $rootScope.$apply();
          });

          it('shows the default template', function() {
            expect(scope.template).toBe('views/templates/new.html');
          });
        });

        describe('when targets not existing device', function() {

          beforeEach(function() {
            compile($rootScope, $compile);
          });

          beforeEach(function() {
            scope = element.scope().$$childTail;
          });

          beforeEach(function() {
            $httpBackend.flush();
          });

          beforeEach(function() {
            $rootScope.$broadcast('lelylan:device:template', { id: '1', template: 'views/templates/new.html' });
            $rootScope.$apply();
          });

          it('shows the default template', function() {
            expect(scope.template).toBe('views/templates/new.html');
          });
        });

        describe('when targets and existing device', function() {

          beforeEach(function() {
            compile($rootScope, $compile);
          });

          beforeEach(function() {
            scope = element.scope().$$childTail;
          });

          beforeEach(function() {
            $httpBackend.flush();
          });

          beforeEach(function() {
            $rootScope.$broadcast('lelylan:device:template:update', { id: '2', template: 'views/templates/new.html' });
            $rootScope.$apply();
          });

          it('shows the default template', function() {
            expect(scope.template).toBe('views/templates/default.html');
          });
        });

      });
    });



    describe('when sets the "device-json"', function() {

      beforeEach(function() {
        element = angular.element('<device device-json=\'' + JSON.stringify(device) + '\'></div>');
      });

      beforeEach(function() {
        compile($rootScope, $compile);
      });

      beforeEach(function() {
        scope = element.scope().$$childTail;
      });

      it('sets scope.device', function() {
        expect(scope.device.name).toBe('Closet dimmer');
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


      describe('when all requests are resolved', function() {

        beforeEach(function() {
          $rootScope.$on('lelylan:device:load', callback);
        });

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

        it('fires the loaded device event', function() {
          var event = jasmine.any(Object);
          expect(callback).toHaveBeenCalledWith(event, scope.device);
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



    describe('when logs in', function() {

      describe('when maker', function() {

        beforeEach(function() {
          Profile.set({ id: 1 });
        });

        describe('when #showSettings', function() {
          beforeEach(function() {
            compile($rootScope, $compile);
            $httpBackend.flush();
            scope = element.scope().$$childTail;
            scope.showSettings();
          });

          describe('when privates are not loaded', function() {

            it('makes the request', function() {
              $httpBackend.expect('GET', 'http://api.lelylan.com/devices/1/privates');
              $httpBackend.flush();
            });

            it('sets scope.private', function() {
              scope = element.scope().$$childTail;
              $httpBackend.flush();
              expect(scope.privates).not.toBe(undefined);
            });
          });
        });
      });


      describe('when not maker', function() {

        beforeEach(function() {
          Profile.set({ id: 2 });
        });

        describe('when #showSettings', function() {
          beforeEach(function() {
            compile($rootScope, $compile);
            $httpBackend.flush();
            scope = element.scope().$$childTail;
            scope.showSettings();
          });

          describe('when privates are not loaded', function() {

            it('sets scope.private', function() {
              scope = element.scope().$$childTail;
              expect(scope.privates).toBe(undefined);
            });
          });
        });
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


    describe('#update', function() {

      beforeEach(function() {
        $rootScope.$on('lelylan:device:update:get', callback);
      });

      beforeEach(function() {
        $httpBackend.whenPUT('http://api.lelylan.com/devices/1').respond(device);
      });

      // block needed to populate scope.device
      beforeEach(function() {
        compile($rootScope, $compile);
        scope = element.scope().$$childTail;
        $httpBackend.flush();
      });

      it('makes the request', function() {
        $httpBackend.expect('PUT', 'http://api.lelylan.com/devices/1');
        scope.update();
        $httpBackend.flush();
      });

      it('fires the update device event', function() {
        scope.update();
        $httpBackend.flush();
        var event = jasmine.any(Object);
        expect(callback).toHaveBeenCalledWith(event, scope.device);
      });
    });


    describe('#destroy', function() {

      beforeEach(function() {
        $rootScope.$on('lelylan:device:delete', callback);
      });

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
        scope.destroy('Closet dimmer');
        $httpBackend.flush();
      });

      it('fires the delete device event', function() {
        scope.destroy('Closet dimmer');
        $httpBackend.flush();
        var event = jasmine.any(Object);
        expect(callback).toHaveBeenCalledWith(event, scope.device);
      });
    });


    describe('when fires a custom event', function() {

      beforeEach(function() {
        $rootScope.$on('lelylan:device:custom:open', callback);
      });

      beforeEach(function() {
        compile($rootScope, $compile);
        scope = element.scope().$$childTail;
        $httpBackend.flush();
      });

      beforeEach(function() {
        scope.fire('open');
      });

      it('fires the update device event', function() {
        var event = jasmine.any(Object);
        expect(callback).toHaveBeenCalledWith(event, scope.device);
      });
    });

    describe('when listen to the update:set event', function() {

      beforeEach(function() {
        compile($rootScope, $compile);
      });

      beforeEach(function() {
        scope = element.scope().$$childTail;
      });

      beforeEach(function() {
        $httpBackend.flush();
      });

      beforeEach(function() {
        var copy = angular.copy(device);
        copy.properties[0].value    = 'on';
        copy.properties[0].expected = 'on';
        $rootScope.$broadcast('lelylan:device:update:set', copy);
      });

      it('updates the device status', function() {
        expect(scope.status.name).toBe('On')
      });
    });
  });




  describe('when raises an error', function() {

    beforeEach(function() {
      device   = JSON.parse(readFixtures('device.json'));
      type     = JSON.parse(readFixtures('type.json'));
    });

    describe('with unauthorized device', function() {

      beforeEach(function() {
        $httpBackend.whenGET('http://api.lelylan.com/devices/1').respond(401);
        $httpBackend.whenGET('http://api.lelylan.com/types/1').respond(type);
      });

      describe('when all requests are resolved', function() {

        beforeEach(function() {
          compile($rootScope, $compile);
          $httpBackend.flush();
        })

        beforeEach(function() {
          scope = element.scope().$$childTail;
        })

        it('shows the message box', function() {
          expect(scope.view.path).toBe('/message');
        });

        it('shows the unauthorized message', function() {
          expect(scope.message.title).toBe('Unauthorized Access');
        });
      });
    });
  });
});

