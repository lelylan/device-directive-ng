'use strict';

describe('DeviceStatuses', function() {

  var $httpBackend, $httpBackend, _function, status, property, statusProperty, result, DeviceStatuses;
  var scope = {};

  beforeEach(module('lelylan.directives.device'));

  beforeEach(inject(function($injector) { DeviceStatuses = $injector.get('DeviceStatuses') }));
  beforeEach(inject(function($injector) { $httpBackend = $injector.get('$httpBackend') }));


  describe('when set the device status', function() {

    beforeEach(function() {
      jasmine.getFixtures().fixturesPath = 'base/test/spec/fixtures';
    });

    beforeEach(function() {
      scope.device = JSON.parse(readFixtures('device.json'));
      scope.type   = JSON.parse(readFixtures('type.json'));
    });


    describe('.set', function() {

      beforeEach(function() {
        spyOn(DeviceStatuses, 'set');
      });

      beforeEach(function() {
        DeviceStatuses.set(scope);
      });

      it('calls #setForm method for each function', function() {
        expect(DeviceStatuses.set.calls.count()).toBe(1);
      });
    });


    describe('.checkStatus', function() {

      beforeEach(function() {
        property = scope.device.properties[1];
      });

      describe('with matching properties', function() {

        beforeEach(function() {
          status = [
            { id: '1', pending: false, values: ['off'], ranges: [] },
            { id: '2', pending: false, values: [], ranges: [ { min: 0, max: 20 } ] }
          ]
        });

        beforeEach(function() {
          result = DeviceStatuses.checkStatus(property, { properties: [statusProperty] });
        });

        it('returns true', function() {
          expect(result).toBe(true);
        });
      });

      describe('with no matching properties', function() {

        beforeEach(function() {
          status = {
            properties: [
              { id: '1', pending: false, values: ['on'], ranges: [] }, // 'on' not mathing
              { id: '2', pending: false, values: [], ranges: [ { min: 0, max: 20 } ] }
            ]
          }
        });

        beforeEach(function() {
          result = DeviceStatuses.checkStatus(status, scope.device);
        });

        it('returns true', function() {
          expect(result).toBe(false);
        });
      });
    });


    describe('.passProperty', function() {

      beforeEach(function() {
        property = scope.device.properties[1];
      });

      describe('with matching pending & values', function() {

        beforeEach(function() {
          statusProperty = { id: '2', pending: false, values: ['0'], ranges: [] };
        });

        beforeEach(function() {
          result = DeviceStatuses.passProperty(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(true);
        });
      });

      describe('with matching pending & range', function() {

        beforeEach(function() {
          statusProperty = { id: '2', pending: false, values: [], ranges: [{ min: 0, max: 20 }] };
        });

        beforeEach(function() {
          result = DeviceStatuses.passProperty(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(true);
        });
      });

      describe('with matching pending & values & range', function() {

        beforeEach(function() {
          statusProperty = { id: '2', pending: false, values: ['0'], ranges: [{ min: 0, max: 20 }] };
        });

        beforeEach(function() {
          result = DeviceStatuses.passProperty(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(true);
        });
      });

      describe('with no matching values', function() {

        beforeEach(function() {
          statusProperty = { id: '2', pending: false, values: ['100.0'], ranges: [] };
        });

        beforeEach(function() {
          result = DeviceStatuses.passProperty(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(false);
        });
      });

      describe('with no matching pending', function() {

        beforeEach(function() {
          statusProperty = { id: '2', pending: true, values: ['0.0'], ranges: [] };
        });

        beforeEach(function() {
          result = DeviceStatuses.passProperty(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(false);
        });
      });

      describe('with no matching ranges', function() {

        beforeEach(function() {
          statusProperty = { id: '2', pending: false, values: [], ranges: [{ min: 10, max: 20 }] };
        });

        beforeEach(function() {
          result = DeviceStatuses.passProperty(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(false);
        });
      });

      describe('with no params', function() {

        beforeEach(function() {
          statusProperty = { id: '2', pending: null, values: [], ranges: [] };
        });

        beforeEach(function() {
          result = DeviceStatuses.passProperty(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(true);
        });
      });
    });


    describe('.checkPending', function() {

      beforeEach(function() {
        property = scope.device.properties[0];
      });

      describe('with matching penging value', function() {

        beforeEach(function() {
          statusProperty = { id: '1', pending: false };
        });

        beforeEach(function() {
          result = DeviceStatuses.checkPending(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(true);
        });
      });

      describe('with no matching penging value', function() {

        beforeEach(function() {
          statusProperty = { id: '1', pending: true };
        });

        beforeEach(function() {
          result = DeviceStatuses.checkPending(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(false);
        });
      });

      describe('with null penging value', function() {

        beforeEach(function() {
          statusProperty = { id: '1', pending: null };
        });

        beforeEach(function() {
          result = DeviceStatuses.checkPending(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(true);
        });
      });
    });


    describe('.checkValues', function() {

      beforeEach(function() {
        property = scope.device.properties[0];
      });

      describe('with matching values', function() {

        beforeEach(function() {
          statusProperty = { id: '1', values: ['off'] };
        });

        beforeEach(function() {
          result = DeviceStatuses.checkValues(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(true);
        });
      });

      describe('with no matching values', function() {

        beforeEach(function() {
          statusProperty = { id: '1', values: ['on'] };
        });

        beforeEach(function() {
          result = DeviceStatuses.checkValues(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(false);
        });
      });

      describe('with no values', function() {

        beforeEach(function() {
          statusProperty = { id: '1', values: [] };
        });

        beforeEach(function() {
          result = DeviceStatuses.checkValues(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(true);
        });
      });
    });


    describe('.checkRanges', function() {

      beforeEach(function() {
        property = scope.device.properties[1];
      });

      describe('with matching values', function() {

        beforeEach(function() {
          statusProperty = { id: '2', ranges: [ { min: 0, max: 20}, { min: 80, max: 90 } ] };
        });

        beforeEach(function() {
          result = DeviceStatuses.checkRanges(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(true);
        });
      });

      describe('with no matching values', function() {

        beforeEach(function() {
          statusProperty = { id: '2', ranges: [ { min: 10, max: 20}, { min: 80, max: 90 } ] };
        });

        beforeEach(function() {
          result = DeviceStatuses.checkRanges(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(false);
        });
      });

      describe('with no range', function() {

        beforeEach(function() {
          statusProperty = { id: '2', ranges: [] };
        });

        beforeEach(function() {
          result = DeviceStatuses.checkRanges(property, statusProperty);
        });

        it('returns true', function() {
          expect(result).toBe(true);
        });
      });
    });
  });
});
