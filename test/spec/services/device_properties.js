'use strict';

describe('DeviceProperties', function() {

  var $httpBackend, DeviceProperties, properties, result;
  var scope = {};

  beforeEach(module('lelylan.directives.device'));

  beforeEach(inject(function($injector) { DeviceProperties = $injector.get('DeviceProperties') }));


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


    describe('#filter', function() {

      beforeEach(function() {
        result = DeviceProperties.filter(properties);
      });

      it('returns only the params needed to update the device properties', function() {
        var expected = [{ id: '1', pending: undefined, expected: undefined }];
        expect(result).toEqual(jasmine.objectContaining(expected));
      });
    });
  });
});
