describe('<device>', function() {

  beforeEach(function() {
    browser.get('http://localhost:9000');
  });


  describe('header', function() {

    it('shows the device name', function() {
      var name = $('.ly-header .ly-name').getText();
      expect(name).toEqual('Closet dimmer');
    });
  });
});
