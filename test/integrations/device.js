describe('<device>', function() {
  it('should see the widget', function() {
    browser.get('/');
    expect(element(by.css('.ly-header .ly-name')).getText()).toEqual('Closet dimmer');
  });
});
