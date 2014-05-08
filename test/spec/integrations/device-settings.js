describe('<device>', function() {

  beforeEach(function() {
    browser.get('http://localhost:9000');
  });


  describe('settings', function() {

    it('does not show the settings', function() {
      expect($('.ly-settings').isPresent()).toBe(false);
    });


    describe('when opens', function() {

      beforeEach(function() {
        $('.ly-menu .ly-menu-settings').click();
      });


      describe('when shows the settings', function() {

        it('shows the settings window', function() {
          expect($('.ly-settings-device').isPresent()).toBe(true);
        });

        it('shows the settings info', function() {
          expect($('.ly-settings .ly-form .ly-id').getAttribute('value')).toBe('1');
          expect($('.ly-settings .ly-form .ly-secret').getAttribute('value')).toBe('secret');
          expect($('.ly-settings .ly-form .ly-type').getText()).toBe('Dimmer');
          expect($('.ly-settings .ly-form .ly-name').getAttribute('value')).toBe('Closet dimmer');
          expect($('.ly-settings .ly-form .ly-physical').getAttribute('value')).toBe('https://node.lelylan.com/mqtt/devices/1');
        });
      });


      describe('when updates the name', function() {

        describe('with the update button', function() {

          beforeEach(function() {
            $('.ly-settings .ly-form .ly-name').sendKeys(' updated');
            $('.ly-settings .ly-update-button').click();
          });

          it('updates the device', function() {
            expect($('.ly-header .ly-name').getText()).toEqual('Closet dimmer updated');
            expect($('.ly-settings-device').isPresent()).toBe(false);
          });
        });

        describe('with the enter key', function() {

          beforeEach(function() {
            $('.ly-settings .ly-form .ly-name').sendKeys(' updated', protractor.Key.ENTER);
          });

          it('updates the device', function() {
            expect($('.ly-header .ly-name').getText()).toEqual('Closet dimmer updated');
            expect($('.ly-settings-device').isPresent()).toBe(false);
          });
        });
      });


      describe('when closes', function() {

        describe('with the close button', function() {

          beforeEach(function() {
            $('.ly-settings .ly-close').click();
          });

          it('closes the settings window', function() {
            expect($('.ly-settings-device').isPresent()).toBe(false);
          });
        });
      });
    });
  });
});
