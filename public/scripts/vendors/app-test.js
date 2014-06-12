var app = angular.module('app', ['lelylan.directives.device', 'ngMockE2E']);

// mock all requests we need
app.run(function($httpBackend, $timeout, Profile) {
  Profile.set({id: '1'});

  $httpBackend.when('GET', /\/templates\//).passThrough();
  $httpBackend.whenGET('http://api.lelylan.com/devices/1').respond(device);
  $httpBackend.whenPUT('http://api.lelylan.com/devices/1')
    .respond(function(method, url, data, headers) { return [200, updateDevice(data), {}]; });
  $httpBackend.whenPUT('http://api.lelylan.com/devices/1/properties')
    .respond(function(method, url, data, headers) { return [200,  updateDeviceProperties(data), {}]; });
  $httpBackend.whenDELETE('http://api.lelylan.com/devices/1').respond(device);
  $httpBackend.whenGET('http://api.lelylan.com/types/1').respond(type);
  $httpBackend.whenGET('http://api.lelylan.com/devices/1/privates').respond(privates);

  var updateDevice = function(data) {
    data = angular.fromJson(data);
    device.updated_at   = new Date();
    device.name         = data.name;
    device.physical.uri = data.physical.uri;
    return device;
  }

  var updateDeviceProperties = function(data) {
    data = angular.fromJson(data);
    device.updated_at = new Date();
    _.each(data.properties, function(property) {
      var result = _.find(device.properties, function(_property) { return _property.id == property.id; } );
      result.expected = result.value = property.expected; });
    return device;
  }
});

device = {
  "id": "1",
  "uri": "http://www.example.com/devices/1",
  "name": "Closet dimmer",
  "categories": ["lights"],
  "pending": false,
  "activated": true,
  "type": {
    "id": "1",
    "uri": "https://type.lelylan.com/types/dimmer"
  },
  "properties": [{
    "id": "1",
    "uri": "https://type.lelylan.com/properties/status",
    "value": "off",
    "expected": "off",
    "pending": false,
    "accepted": null
  }, {
    "id": "2",
    "uri": "https://type.lelylan.com/properties/intensity",
    "expected": "0",
    "value": "0",
    "pending": false,
    "accepted": null
  }],
  "physical": {
    "uri": "https://node.lelylan.com/mqtt/devices/1"
  },
  "maker": {
    "id": "1",
    "uri": "http://api.lelylan.com/people/1"
  },
  "owner": {
    "id": "2",
    "uri": "http://api.lelylan.com/people/2"
  },
  "created_at": "2011-06-20T15:54:42Z",
  "updated_at": "2011-04-23T15:55:31Z",
  "updated_from": "you"
}

privates = {
  "uri": "http://api.lelylan.com/devices/5042344b95fc441000000001",
  "id": "1",
  "name": "Closet dimmer",
  "secret": "secret",
  "activation_code": "activation_code"
}

type = {
    "id": "1",
    "uri": "http://www.example.com/types/50042612d033a9b4ac0007fa",
    "name": "Dimmer",
    "description": "Dimmer description",
    "categories": ["lights"],
    "owner": {
      "id": "1",
      "uri": "http://api.lelylan.com/people/1"
    },
    "created_at": "2012-07-16T14:32:50Z",
    "updated_at": "2012-07-16T14:32:50Z",
    "properties": [{
      "id": "1",
      "uri": "http://www.example.com/properties/status",
      "name": "Status",
      "type": "text",
      "default": "0",
      "accepted": { "on": "On", "off": "Off" },
      "created_at": "2012-07-16T14:32:50Z",
      "updated_at": "2012-07-16T14:32:50Z"
    },
    {
      "uri": "http://www.example.com/properties/intensity",
      "id": "2",
      "name": "Intensity",
      "type": "range",
      "range": { "min": "0", "max": "100", "step": "1" },
      "default": "0",
      "created_at": "2012-07-16T14:32:50Z",
      "updated_at": "2012-07-16T14:32:50Z"
    }],
    "functions": [{
        "uri": "http://www.example.com/functions/50042612d033a9b4ac0007f0",
        "id": "1",
        "name": "Turn on",
        "created_at": "2012-07-16T14:32:50Z",
        "updated_at": "2012-07-16T14:32:50Z",
        "properties": [{
          "id": "1",
          "uri": "http://www.example.com/properties/status",
          "expected": "on"
        }]
    },
    {
        "uri": "http://www.example.com/functions/50042612d033a9b4ac0007f2",
        "id": "2",
        "name": "Turn off",
        "created_at": "2012-07-16T14:32:50Z",
        "updated_at": "2012-07-16T14:32:50Z",
        "properties": [{
          "id": "1",
          "uri": "http://www.example.com/properties/status",
          "expected": "off"
        }]
    },
    {
        "uri": "http://www.example.com/functions/50042612d033a9b4ac0007f5",
        "id": "3",
        "name": "Set intensity",
        "created_at": "2012-07-16T14:32:50Z",
        "updated_at": "2012-07-16T14:32:50Z",
        "properties": [{
          "id": "1",
          "uri": "http://www.example.com/properties/status",
          "expected": "on"
        },
        {
          "id": "2",
          "uri": "http://www.example.com/properties/intensity",
          "expected": null
        }]
    }],
    "statuses": [{
        "uri": "http://www.example.com/statuses/50042612d033a9b4ac0007f8",
        "id": "50042612d033a9b4ac0007f8",
        "name": "On",
        "created_at": "2012-07-16T14:32:50Z",
        "updated_at": "2012-07-16T14:32:50Z",
        "function": {
          "id": "2",
          "uri": "http://www.example.com/functions/turn-off"
        },
        "properties": [{
          "id": "1",
          "uri": "http://www.example.com/properties/status",
          "pending": false,
          "values": ["on"],
          "ranges": []
        }]
      }, {
        "uri": "http://www.example.com/statuses/50042612d033a9b4ac0007f8",
        "id": "50042612d033a9b4ac0007f8",
        "name": "Off",
        "created_at": "2012-07-16T14:32:50Z",
        "updated_at": "2012-07-16T14:32:50Z",
        "function": {
          "id": "1",
          "uri": "http://www.example.com/functions/turn-on"
        },
        "properties": [{
          "id": "1",
          "uri": "http://www.example.com/properties/status",
          "pending": false,
          "values": ["off"],
          "ranges": []
        }]
    }]
}

