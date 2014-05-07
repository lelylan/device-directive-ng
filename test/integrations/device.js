describe('<device>', function() {

  beforeEach(function() {
    browser.get('http://localhost:9000');
  });


  //describe('header', function() {

    //it('shows the device name', function() {
      //var name = $('.ly-header .ly-name').getText();
      //expect(name).toEqual('Closet dimmer');
    //});

    //it('does not show the settings', function() {
      //expect($('.ly-settings').isPresent()).toBe(false);
    //});
  //});


  describe('settings', function() {

    describe('when open', function() {

      beforeEach(function() {
        $('.ly-menu .ly-menu-settings').click();
      });

      //it('shows the settings window', function() {
        //expect($('.ly-settings-device').isPresent()).toBe(true);
      //});

      //it('shows the settings info', function() {
        //expect($('.ly-settings .ly-form .ly-id').getAttribute('value')).toBe('1');
        //expect($('.ly-settings .ly-form .ly-secret').getAttribute('value')).toBe('secret');
        //expect($('.ly-settings .ly-form .ly-type').getText()).toBe('Dimmer');
        //expect($('.ly-settings .ly-form .ly-name').getAttribute('value')).toBe('Closet dimmer');
        //expect($('.ly-settings .ly-form .ly-physical').getAttribute('value')).toBe('https://node.lelylan.com/mqtt/devices/1');
      //});

      describe('when updates the device', function() {

        $('.ly-settings .ly-form .ly-name').sendKeys('Dimmer');
        $('.ly-settings .ly-update').click();

        expect($('.ly-settings-device').isPresent()).toBe(false);
        //var name = $('.ly-header .ly-name').getText();
        //expect(name).toEqual('Closet dimmer');
      });


      //describe('when closes', function() {

        //describe('when clicks on the close button', function() {

          //beforeEach(function() {
            //$('.ly-settings .ly-close').click();
          //});

          //it('closes the settings window', function() {
            //expect($('.ly-settings-device').isPresent()).toBe(false);
          //});
        //});

        //// TODO this test should work but it does not
        ////describe('when clicks on the modal backdrop', function() {

          ////beforeEach(function() {
            ////$('.ly-settings .ly-modal-backdrop').click();
          ////});

          ////it('closes the settings window', function() {
            ////expect($('.ly-settings').isPresent()).toBe(false);
          ////});
        ////});
      //});
    });
  });
});
