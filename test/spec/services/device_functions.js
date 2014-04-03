'use strict';

describe('DeviceFunction', function() {

  var $httpBackend, $httpBackend, _function, payload, result, DeviceProperties, DeviceFunction;
  var scope = {};

  beforeEach(module('lelylan.directives.device'));

  beforeEach(inject(function($injector) { DeviceProperties = $injector.get('DeviceProperties') }));
  beforeEach(inject(function($injector) { DeviceFunction   = $injector.get('DeviceFunction') }));
  beforeEach(inject(function($injector) { $httpBackend     = $injector.get('$httpBackend') }));


  describe('when sets form values', function() {

    beforeEach(function() {
      jasmine.getFixtures().fixturesPath = 'base/test/spec/fixtures';
    });

    beforeEach(function() {
      scope.device = JSON.parse(readFixtures('device.json'));
      scope.type   = JSON.parse(readFixtures('type.json'));
    });

    beforeEach(function() {
      _function = scope.type.functions[2];
    });


    describe('.setForms', function() {

      beforeEach(function() {
        spyOn(DeviceFunction, 'setForm');
      });

      beforeEach(function() {
        DeviceFunction.setForms(scope);
      });

      it('copies the type functions in the scope', function() {
        expect(scope.functions.length).toBe(3);
      });

      it('calls #setForm method for each function', function() {
        expect(DeviceFunction.setForm.calls.count()).toBe(3);
      });
    });


    describe('.setForm', function() {

      beforeEach(function() {
        spyOn(DeviceFunction, 'setPropertiesToFill');
        spyOn(DeviceFunction, 'setFunctionToFill');
        spyOn(DeviceFunction, 'setExpectedProperties');
        spyOn(DeviceFunction, 'extendFunctionProperties');
      });

      beforeEach(function() {
        DeviceFunction.setForm(_function, scope);
      });

      it('calls #setPropertiesToFill', function() {
        expect(DeviceFunction.setPropertiesToFill).toHaveBeenCalled();
      });

      it('calls #setFunctionToFill', function() {
        expect(DeviceFunction.setFunctionToFill).toHaveBeenCalled();
      });

      it('calls #setExpectedProperties', function() {
        expect(DeviceFunction.setExpectedProperties).toHaveBeenCalled();
      });

      it('calls #extendFunctionProperties', function() {
        expect(DeviceFunction.extendFunctionProperties).toHaveBeenCalled();
      });
    });
  });
});
