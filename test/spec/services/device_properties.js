'use strict';

describe('DeviceProperties', function() {

  var $httpBackend, DeviceProperties, functionProperties;
  var scope = {};

  beforeEach(module('lelylan.directives.device'));

  beforeEach(inject(function($injector) { DeviceProperties = $injector.get('DeviceProperties') }));

  describe('.update', function() {

    beforeEach(function() {
      jasmine.getFixtures().fixturesPath = 'base/test/spec/fixtures';
    });

    beforeEach(function() {
      scope.device = readFixtures('device.json');
    });

    beforeEach(function() {
      scope.type = readFixtures('type.json');
    });

    describe('when executes a function', function() {

      beforeEach(function() {
        functionProperties = scope.type.functions[0].properties;
      });

      beforeEach(function() {
        DeviceProperties.update(scope, functionProperties)
      });

      it('updates the device properties', function() {
        expect(true).toBe(true);
      });

      it('update property values before the API response', function() {
      });

      it('makes the update properties request', function() {
      });

      it('gets the updated device', function() {
      });

      it('resets the functions form', function() {
      });
    });
  });
});
