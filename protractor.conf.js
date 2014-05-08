// An example configuration file.
exports.config = {

  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  suites: {
    sensor:    'test/spec/integrations/device-sensor.js',
    header:    'test/spec/integrations/device-header.js',
    status:    'test/spec/integrations/device-status.js',
    functions: 'test/spec/integrations/device-functions.js',
    settings:  'test/spec/integrations/device-settings.js',
    delete:    'test/spec/integrations/device-delete.js',
  },

  // bypass the need of a selenium server
  chromeOnly: true,

  baseUrl: 'http://localhost:9000',

  jasmineNodeOpts: {
    showColors: true
  }
};
