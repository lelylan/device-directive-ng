describe('<device>', function() {

  beforeEach(function() {
    browser.get('http://localhost:9000');
  });


  describe('when executes a function', function() {

    describe('with no required params', function() {

      beforeEach(function() {
        $('.ly-function-container:nth-child(1) .ly-execute').click();
      });

      it('turns on the device', function() {
        expect($('.ly-status .ly-name').getText()).toBe('On');
        expect($('.ly-property:nth-child(1) .ly-value').getText()).toBe('on');
      });
    });

    describe('with required params', function() {

      beforeEach(function() {
        $('.ly-function-container:nth-child(4) .ly-execute').click();
      });

      it('shows the function form fields', function() {
        expect($('.ly-function-container:nth-child(4) .ly-function-form').isPresent()).toBe(true);
      });

      describe('when sets the input value', function() {

        beforeEach(function() {
          var form = $('.ly-function-container:nth-child(4) .ly-function-form');
          form.$('.ly-url').sendKeys('/updated');
          form.$('.ly-update-button').click();
        });

        it('sets the device intensity', function() {
          expect($('.ly-property:nth-child(6) .ly-value').getText()).toBe('http://example.com/updated');
        });
      });

      describe('when closes', function() {

        describe('with the close button', function() {

          beforeEach(function() {
            $('.ly-function-container:nth-child(4) .ly-close').click();
          });

          it('closes the settings window', function() {
            expect($('.ly-function-container:nth-child(4) .ly-function-form').isPresent()).toBe(false);
          });
        });
      });
    });
  });
});
