'use strict';

describe('DeviceProperties', function() {

  var $httpBackend, $httpBackend, properties, payload, result, DeviceProperties, DeviceFunction;
  var scope = {};

  beforeEach(module('lelylan.directives.device'));

  beforeEach(inject(function($injector) { DeviceProperties = $injector.get('DeviceProperties') }));
  beforeEach(inject(function($injector) { DeviceFunction   = $injector.get('DeviceFunction') }));
  beforeEach(inject(function($injector) { $httpBackend     = $injector.get('$httpBackend') }));


  describe('when executes a function', function() {

    beforeEach(function() {
      spyOn(DeviceFunction, 'setForms');
    });

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


    describe('.filter', function() {

      beforeEach(function() {
        result = DeviceProperties.filter(properties);
      });

      beforeEach(function() {
        payload = [{ id: '1', pending: undefined, expected: undefined }];
      })

      it('returns only the params needed to update the device properties', function() {
        expect(result).toEqual(jasmine.objectContaining(payload));
      });
    });


    describe('.sendProperties', function() {

      beforeEach(function() {
        payload = { id: '1', properties: [{ id: '1', pending: true, expected: 'on' }]};
      });

      beforeEach(function() {
        result = JSON.parse(readFixtures('device.json'));
        result.properties[0].expected = 'on';
      });

      beforeEach(function() {
        $httpBackend.whenPUT('http://api.lelylan.com/devices/1/properties', payload).respond(result);
      });

      beforeEach(function() {
        expect(scope.device.properties[0].expected).toBe('off');
      })

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

      it('set the functions form fields with the updated properties', function() {
        DeviceProperties.sendProperties(scope, payload.properties);
        $httpBackend.flush();
        expect(DeviceFunction.setForms).toHaveBeenCalled();
      });
    });


    describe('.presetProperties', function() {

      beforeEach(function() {
        payload = [{ id: '1', pending: true, expected: 'on' }];
      });

      it('pre applies the updated device representation', function() {
        DeviceProperties.presetProperties(scope, payload);
        expect(scope.device.properties[0].expected).toBe('on');
      });
    });
  });
});
