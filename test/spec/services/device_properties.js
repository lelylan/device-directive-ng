'use strict';

describe('DeviceProperties', function() {

  var $httpBackend, $httpBackend, DeviceProperties, properties, payload, result;
  var scope = {};

  beforeEach(module('lelylan.directives.device'));

  beforeEach(inject(function($injector) { DeviceProperties = $injector.get('DeviceProperties') }));
  beforeEach(inject(function($injector) { $httpBackend    = $injector.get('$httpBackend') }));


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


    describe('.properties', function() {

      beforeEach(function() {
        payload = { id: '1', properties: [{ id: '1', pending: true, expected: 'on' }]};
      });

      beforeEach(function() {
        result = JSON.parse(readFixtures('device.json'));
        result.properties[0].value = 'on';
        $httpBackend.whenPUT('http://api.lelylan.com/devices/1/properties', payload).respond(result);
      });

      beforeEach(function() {
        expect(scope.device.properties[0].value).toBe('off');
      })

      it('makes the request', function() {
        $httpBackend.expect('PUT', 'http://api.lelylan.com/devices/1/properties', payload);
        DeviceProperties.properties(scope, payload.properties);
        $httpBackend.flush();
      });

      it('gets the updated device representation', function() {
        DeviceProperties.properties(scope, payload.properties);
        $httpBackend.flush();
        expect(scope.device.properties[0].value).toBe('on');
      });

      it('gets the updated device', function() {
        DeviceProperties.properties(scope, payload.properties);
        $httpBackend.flush();
        expect(scope.device.properties[0].value).toBe('on');
      });
    });
  });
});
