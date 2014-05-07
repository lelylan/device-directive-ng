// An example configuration file.
exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  specs: [
    'test/integrations/device.js'
  ],

  baseUrl: 'http://localhost:9000',

  jasmineNodeOpts: {
    showColors: true
  }
};
