'use strict';

describe('DeviceProperties', function() {

  var $rootScope, $httpBackend, $httpBackend, properties, payload, result, DeviceProperties, DeviceFunction;
  var callback, event = jasmine.any(Object);
  var scope = {};

  beforeEach(module('lelylan.directives.device'));

  beforeEach(inject(function($injector) { $rootScope       = $injector.get('$rootScope') }));
  beforeEach(inject(function($injector) { $httpBackend     = $injector.get('$httpBackend') }));
  beforeEach(inject(function($injector) { DeviceProperties = $injector.get('DeviceProperties') }));
  beforeEach(inject(function($injector) { DeviceFunction   = $injector.get('DeviceFunction') }));
  beforeEach(inject(function($injector) { callback         = jasmine.createSpy('callback') }));


  describe('when executes a function', function() {

    beforeEach(function() {
      jasmine.getFixtures().fixturesPath = 'base/test/spec/fixtures';
    });

    beforeEach(function() {
      scope.device = JSON.parse(readFixtures('device.json'));
      scope.type   = JSON.parse(readFixtures('type.json'));
    });

    beforeEach(function() {
      // properties coming from the function form
      properties = scope.type.functions[0].properties;
    });


    describe('.update', function() {

      beforeEach(function() {
        spyOn(DeviceProperties, 'mapProperties');
        spyOn(DeviceProperties, 'sendProperties');
        spyOn(DeviceProperties, 'optimisticProperties');
      });

      beforeEach(function() {
        DeviceProperties.update(scope, properties);
      });

      it('#mapProperties', function() {
        expect(DeviceProperties.mapProperties).toHaveBeenCalled();
      });

      it('#sendProperties', function() {
        expect(DeviceProperties.sendProperties).toHaveBeenCalled();
      });

      it('#optimisticProperties', function() {
        expect(DeviceProperties.optimisticProperties).toHaveBeenCalled();
      });

      it('sets the pending status to true', function() {
        expect(scope.device.pending).toBe(true);
      });
    });


    describe('.mapProperties', function() {

      beforeEach(function() {
        result = DeviceProperties.mapProperties(properties);
      });

      beforeEach(function() {
        payload = [{ id: '1', pending: undefined, expected: 'on' }];
      })

      it('returns only the params needed to update the device properties', function() {
        expect(result).toEqual(jasmine.objectContaining(payload));
      });
    });


    describe('.sendProperties', function() {

      beforeEach(function() {
        payload = { properties: [{ id: '1', pending: true, expected: 'on' }]};
      });

      describe('with response 202 (Accepted)', function() {

        beforeEach(function() {
          result = JSON.parse(readFixtures('device.json'));
          result.properties[0].expected = 'on';
        });

        beforeEach(function() {
          $httpBackend.whenPUT('http://api.lelylan.com/devices/1/properties', payload).respond(202, result);
        });

        beforeEach(function() {
          expect(scope.device.properties[0].expected).toBe('off');
        });

        it('makes the request', function() {
          $httpBackend.expect('PUT', 'http://api.lelylan.com/devices/1/properties', payload);
          DeviceProperties.sendProperties(scope, payload.properties);
          $httpBackend.flush();
        });

        it('gets the updated device representation', function() {
          DeviceProperties.sendProperties(scope, payload.properties);
          $httpBackend.flush();
          expect(scope.device.properties[0].expected).toBe('on');
        });

        it('fires the start function event', function() {
          $rootScope.$on('lelylan:device:properties:send', callback);
          DeviceProperties.sendProperties(scope, payload.properties);
          expect(callback).toHaveBeenCalledWith(event, scope.device);
        });


        it('does not fires the udate:set event', function() {
          $rootScope.$on('lelylan:device:update:set', callback);
          DeviceProperties.sendProperties(scope, payload.properties);
          $httpBackend.flush();
          expect(callback).not.toHaveBeenCalledWith(event, scope.device);
        });
      });

      describe('with response 200 (Accepted)', function() {

        beforeEach(function() {
          $httpBackend.whenPUT('http://api.lelylan.com/devices/1/properties', payload).respond(200, result);
        });

        it('fires the udate:set event', function() {
          $rootScope.$on('lelylan:device:update:set', callback);
          DeviceProperties.sendProperties(scope, payload.properties);
          $httpBackend.flush();
          expect(callback).toHaveBeenCalledWith(event, scope.device);
        });
      });
    });


    describe('.optimisticProperties', function() {

      beforeEach(function() {
        payload = [{ id: '1', pending: true, expected: 'on' }];
      });

      it('pre applies the updated device representation', function() {
        DeviceProperties.optimisticProperties(scope, payload);
        expect(scope.device.properties[0].expected).toBe('on');
      });
    });
  });
});
