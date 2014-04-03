'use strict';

describe('DeviceStatuses', function() {

  var $httpBackend, $httpBackend, _function, property, statusProperty, result, DeviceStatuses;
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
