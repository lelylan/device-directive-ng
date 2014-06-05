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


    describe('.setForms', function() {

      beforeEach(function() {
        spyOn(DeviceFunction, 'setForm');
      });

      beforeEach(function() {
        DeviceFunction.setForms(scope);
      });

      it('copies the type functions in the scope', function() {
        expect(scope.functions.length).toBe(4);
      });

      it('calls #setForm method for each function', function() {
        expect(DeviceFunction.setForm.calls.count()).toBe(4);
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
        _function = scope.type.functions[0];
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


    describe('.setPropertiesToFill', function() {

      describe('when turns the light on', function() {

        beforeEach(function() {
          _function = scope.type.functions[0];
        });

        beforeEach(function() {
          DeviceFunction.setPropertiesToFill(_function);
        });

        it('sets status#toFill to false', function() {
          expect(_function.properties[0].toFill).toBe(false);
        });
      });

      describe('when dimmers the light intensity', function() {

        beforeEach(function() {
          _function = scope.type.functions[2];
        });

        beforeEach(function() {
          DeviceFunction.setPropertiesToFill(_function);
        });

        it('sets status#toFill to false', function() {
          expect(_function.properties[0].toFill).toBe(false);
        });

        it('sets status#toFill to true', function() {
          expect(_function.properties[1].toFill).toBe(true);
        });
      });
    });


    describe('.setFunctionToFill', function() {

      describe('when turns the light on', function() {

        beforeEach(function() {
          _function = scope.type.functions[0];
        });

        beforeEach(function() {
          DeviceFunction.setPropertiesToFill(_function);
          DeviceFunction.setFunctionToFill(_function);
        });

        it('sets function#toFill to false', function() {
          expect(_function.toFill).toBe(false);
        });
      });

      describe('when dimmers the light intensity', function() {

        beforeEach(function() {
          _function = scope.type.functions[2];
        });

        beforeEach(function() {
          DeviceFunction.setPropertiesToFill(_function);
          DeviceFunction.setFunctionToFill(_function);
        });

        it('sets function#toFill to true', function() {
          expect(_function.toFill).toBe(true);
        });
      });
    });


    describe('.setExpectedProperties', function() {

      beforeEach(function() {
        _function = scope.type.functions[2];
      });

      beforeEach(function() {
        DeviceFunction.setPropertiesToFill(_function);
      });

      beforeEach(function() {
        DeviceFunction.setExpectedProperties(_function, scope);
      });

      it('keeps the status expected value', function() {
        expect(_function.properties[0].expected).toBe('on');
      });

      it('updates the intensity expected value', function() {
        expect(_function.properties[1].expected).toBe('0');
      });
    });


    describe('.extendFunctionProperties', function() {

      beforeEach(function() {
        _function = scope.type.functions[2];
      });

      beforeEach(function() {
        DeviceFunction.extendFunctionProperties(_function, scope);
      });

      describe('status', function() {

        it('adds the attributes defined in the status type property', function() {
          var payload = { "on": "On", "off": "Off" };
          expect(_function.properties[0].accepted).toEqual(jasmine.objectContaining(payload));
          expect(_function.properties[0].type).toBe('text');
        });
      });

      describe('intensity', function() {

        it('adds the attributes defined in the intenisty type property', function() {
          var payload = { "min": "0", "max": "100", "step": "1" };
          expect(_function.properties[1].range).toEqual(jasmine.objectContaining(payload));
          expect(_function.properties[1].type).toBe('range');
        });
      });
    });
  });
});
