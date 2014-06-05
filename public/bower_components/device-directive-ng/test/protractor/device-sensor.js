describe('<device>', function() {

  beforeEach(function() {
    browser.get('http://localhost:9000/index-sensor.html');
  });


  describe('sensor', function() {

    it('does not show the status and the functions', function() {
      expect($('.ly-status').isPresent()).toBe(false);
      expect($('.ly-functions').isPresent()).toBe(false);
    });
  });
});
