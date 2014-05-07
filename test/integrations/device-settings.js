describe('<device>', function() {

  beforeEach(function() {
    browser.get('http://localhost:9000');
  });


  describe('settings', function() {

    describe('when open', function() {

      /* shows settings */

      beforeEach(function() {
        $('.ly-menu .ly-menu-settings').click();
      });

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

      /* updates device settings */

      describe('when updates the name', function() {

        describe('with the update button', function() {

          beforeEach(function() {
            $('.ly-settings .ly-form .ly-name').sendKeys(' updated');
            $('.ly-settings .ly-update').click();
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

      /* delete device settings */

      describe('when deletes the device', function() {

        describe('with the confermation name', function() {

          beforeEach(function() {
          });

          it('updates the device', function() {
          });
        });

        describe('without the confirmation name', function() {

          beforeEach(function() {
          });

          it('updates the device', function() {
          });
        });
      });

      /* closes settings */

      describe('when gets closed', function() {

        describe('with the close button', function() {

          beforeEach(function() {
            $('.ly-settings .ly-close').click();
          });

          it('closes the settings window', function() {
            expect($('.ly-settings-device').isPresent()).toBe(false);
          });
        });

        // TODO this test should work but it does not
        //describe('with the modal backdrop', function() {

          //beforeEach(function() {
            //$('.ly-settings .ly-modal-backdrop').click();
          //});

          //it('closes the settings window', function() {
            //expect($('.ly-settings').isPresent()).toBe(false);
          //});
        //});
      });
    });
  });
});
