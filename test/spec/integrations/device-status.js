describe('<device>', function() {

  beforeEach(function() {
    browser.get('http://localhost:9000');
  });


  describe('status', function() {

    it('sets the current one', function() {
      expect($('.ly-status .ly-name').getText()).toBe('Off');
      expect($('.ly-status .ly-extras').getText()).toContain('days ago');
    });


    describe('when executes the default function', function() {

      beforeEach(function() {
        $('.ly-status .ly-execute').click();
      });

      it('turns on', function() {
        expect($('.ly-status .ly-name').getText()).toBe('On');
        expect($('.ly-status .ly-extras').getText()).toContain('few seconds ago');
      });

      describe('when twice', function() {

        beforeEach(function() {
          $('.ly-status .ly-execute').click();
        });

        it('turns off', function() {
          expect($('.ly-status .ly-name').getText()).toBe('Off');
        });
      });
    });
  });
});
