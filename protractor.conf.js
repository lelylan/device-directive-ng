// An example configuration file.
exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  specs: [
    'test/spec/integrations/*.js'
  ],

  // bypass the need of a selenium server
  chromeOnly: true,

  baseUrl: 'http://localhost:9000',

  jasmineNodeOpts: {
    showColors: true
  }
};
