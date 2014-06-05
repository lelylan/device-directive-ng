'use strict';

describe('Utils', function() {

  var Utils;

  var resources = [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }];

  beforeEach(module('lelylan.directives.device'));

  beforeEach(inject(function($injector) { Utils = $injector.get('Utils') }));



  describe('.getResource', function() {

    describe('with existing id', function() {
      it('gets the object identified by the id', function() {
        var result = Utils.getResource('1', resources);
        expect(result.name).toBe('Alice');
      });
    });

    describe('with not existing id', function() {
      it('does not get any object', function() {
        var result = Utils.getResource('0', resources);
        expect(result).toBeNull
      });
    });
  });
});
