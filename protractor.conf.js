// An example configuration file.
exports.config = {

  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Test suites (protractor protractor.conf.js --suite=sensor)
  suites: {
    sensor:    'test/protractor/device-sensor.js',
    header:    'test/protractor/device-header.js',
    status:    'test/protractor/device-status.js',
    functions: 'test/protractor/device-functions.js',
    settings:  'test/protractor/device-settings.js',
    delete:    'test/protractor/device-delete.js',
  },

  // Bypass the need of a selenium server
  chromeOnly: true,

  // Running server
  baseUrl: 'http://localhost:9000',

  jasmineNodeOpts: {
    showColors: true
  }
};
