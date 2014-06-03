describe('<device>', function() {

  beforeEach(function() {
    browser.get('http://localhost:9000');
  });


  describe('when wants to delete the device', function() {

    beforeEach(function() {
      $('.ly-menu .ly-menu-settings').click();
      $('.ly-settings .ly-delete-link').click();
    });


    describe('when confirms the action', function() {

      describe('with the right name', function() {

        describe('with the delete button', function() {

          beforeEach(function() {
            $('.ly-delete .ly-form .ly-name').sendKeys('Closet dimmer');
            $('.ly-delete .ly-delete-button').click();
          });

          it('deletes the device', function() {
            expect($('.ly-delete').isPresent()).toBe(false);
            expect($('.ly-generic-message').isPresent()).toBe(true);
            expect($('.ly-generic-message .ly-description').getText()).toEqual('Device deleted')
          });
        });

        describe('with the enter key', function() {

          beforeEach(function() {
            $('.ly-delete .ly-form .ly-name').sendKeys('Closet dimmer', protractor.Key.ENTER);
          });

          it('deletes the device', function() {
            expect($('.ly-delete').isPresent()).toBe(false);
            expect($('.ly-generic-message').isPresent()).toBe(true);
            expect($('.ly-generic-message .ly-description').getText()).toEqual('Device deleted')
          });
        });
      });


      describe('with the wrong name', function() {

        beforeEach(function() {
          $('.ly-delete .ly-form .ly-name').sendKeys('not-valid');
          $('.ly-delete .ly-delete-button').click();
        });

        it('does not delete the device', function() {
          expect($('.ly-delete').isPresent()).toBe(true);
          expect($('.ly-generic-message').isPresent()).toBe(false);
        });
      });

      describe('with no name', function() {

        beforeEach(function() {
          $('.ly-delete .ly-delete-button').click();
        });

        it('does not delete the device', function() {
          expect($('.ly-delete').isPresent()).toBe(true);
          expect($('.ly-generic-message').isPresent()).toBe(false);
        });
      });

      describe('when cancel the operation', function() {

        describe('with the close button', function() {

          beforeEach(function() {
            $('.ly-delete .ly-close').click();
          });

          it('closes the settings window', function() {
            expect($('.ly-content').isPresent()).toBe(true);
            expect($('.ly-delete').isPresent()).toBe(false);
          });
        });
      });
    });
  });
});
