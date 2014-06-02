# Lelylan Device Component

Building HTML5 Apps for the Connected Home.


## Introduction

### What is Lelylan

[Lelylan](http://lelylan.com) makes it easy for developers to monitor and control all devices
in your house providing a simple, open and consistent REST API. Lelylan Device Component is an
AngularJS directive to easily monitor and control your devices in realtime.

### What is a Device

A device is everything you interact with everyday of your life like lights, appliances, alarms,
heating systems, windows, gates, multimedia and much more. In Lelylan a Device is a set of services
you can use to monitor and control any object in the real world.



## Installation

### Using Bower

* `bower install device-component-ng --save`

### Using Github

* [device-component-ng.min.js]()

In this case you'll have to manually install the following libraries.

* [AngularJS](http://angularjs.org/)
* [Underscore](http://documentcloud.github.com/underscore)
* [Lelylan Client](https://github.com/lelylan/lelylan-ng)


## Attributes

The Device Component accepts the following configurations.

* `device-id` - The device ID.

```html
<device device-id="5042344b95fc4410000001"></device>
```

* `device-json` - The device JSON representation.

```html
<device device-json="deviceJSON"></device>
```

* `device-template` - The device HTML template.

```html
<device device-id="5042344b95fc4410000001" device-template="views/templates/custom.html"></device>
```


## Events

The Device Component fires the following events.

* `lelylan:device:update` - The device is updated.
* `lelylan:device:delete` - The device is deleted.
* `lelylan:device:function:start` - A function request is sent.
* `lelylan:device:function:end` - A function response is received.

All events receives the device JSON representation.


## Contributing

Fork the repo on github and send a pull requests with topic branches.
Do not forget to provide specs to your contribution.

### Setup

* Fork and clone the repository
* Run `npm install`

### Unit tests (karma)

* `grunt karma:unit`

### Integration tests (protractor)

Start the server.

* `grunt serve`

Run all integration tests

* `protractor protractor.conf.js`

Or run a specific suite

* `protractor protractor.conf.js --suite=sensor`

### Creating your own distribution

* Fork and clone the repository
* Run `npm install`
* Run `grunt`

The new distribution files will be created in the `dist/` folder.

### Coding guidelines

Follow [github](https://github.com/styleguide/) guidelines.

### Feedback

Use the [issue tracker](http://github.com/lelylan/device-component-ng/issues) for bugs.
[Mail](mailto:touch@lelylan.com) or [Tweet](http://twitter.com/lelylan) us for any idea that can improve the project.

### Links

* [GIT Repository](http://github.com/lelylan/device-component-ng)
* [Lelylan Angular Client](http://lelylan.github.com/lelylan-ng)
* [Lelylan Dev Center](http://dev.lelylan.com)
* [Lelylan Dashboard](http://manage.lelylan.com)

## Authors

[Andrea Reginato](http://twitter.com/andreareginato)


## Contributors

Special thanks to all [contributors](https://github.com/lelylan/device-component-ng/contributors)
for submitting patches.


## Changelog

See [CHANGELOG](https://github.com/lelylan/device-component-ng/blob/master/CHANGELOG.md)


## Copyright

Copyright (c) 2014 [Lelylan](http://lelylan.com).
See [LICENSE](https://github.com/lelylan/device-component-ng/blob/master/LICENSE.md) for details.
