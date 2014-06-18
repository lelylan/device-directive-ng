# Device Directive

AngularJS directive makes it easy to monitor and control your physical devices
(e.g. lights, locks, thermostats) from desktop, tablet, and mobile. To make this possible
it uses [Lelylan](http://lelylan.com), a simple, open and robust REST API for the Connected Home.

# Documentation

[Device directive documentation](http://lelylan.github.io/device-directive-ng)

[![device-directive-ng](http://i.imgur.com/JrFww5o.png)](http://lelylan.github.io/device-directive-ng/)

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
