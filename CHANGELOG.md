# Change Log

All notable changes to this project will be documented in this file
automatically by Versionist. DO NOT EDIT THIS FILE MANUALLY!
This project adheres to [Semantic Versioning](http://semver.org/).

## 1.9.2 - 2020-02-28

* Remove dependency on underscore.string [Pagan Gazzard]

## 1.9.1 - 2019-11-15

* Update gulp for Node 12 compatibility and update Travis CI config [Paulo Castro]
* Improve README re action function: callback and async [Paulo Castro]

## 1.9.0 - 2019-02-25

* Preserve string value of looks-like-integer parameters [Paulo Castro]

## 1.8.2 - 2018-11-13

* Fix ignored error in async action functions [Paulo Castro]
* Dependencies: Update lodash and underscore.string packages [Lucian Buzzo]

## v1.8.1 - 2018-08-28

* License: Change license to Apache 2.0 [Giovanni Garufi]
* Changelog: Add CHANGELOG.md [Giovanni Garufi]

## 1.8.0

* fix: Fix multi word variadic commands

## 1.7.5

* Cli: Parse escaped commands correctly
* Add example default command

## 1.7.4

* Don't parse a single dot as a float number.

## 1.7.3

* Don't evaluate numbers in scientific notation automatically.

## 1.7.2

* Replace `minimist` with `yargs-parser`.

## 1.7.1

* Fix required options errors being thrown synchronously.

## 1.7.0

* Add `option#toString()` method as an utility build help pages.

## 1.6.2

* Add `EACCES` code to the error thrown on "root" commands.

## 1.6.1

* Fix issue with command option values that started with numbers.

## 1.6.0

* Implement root property support.

## 1.5.0

* Expose internal utils object as `capitano.utils`.

## 1.4.0

* Stdin support. See [#12](https://github.com/resin-io/capitano/issues/12).

Notice `capitano.state.getMatchCommand()` is now async.

## 1.3.1

* Catch action errors and send them to the callback automatically. See [#17](https://github.com/resin-io/capitano/pull/17).

## 1.3.0

* Implement permission support. Discussed in [#15](https://github.com/resin-io/capitano/issues/15).

## 1.2.0

* Implement action callback support. Discussed in [#11](https://github.com/resin-io/capitano/issues/11).

## 1.1.1

* Fix issue with parsing words that start with a number.

## 1.1.0

* Implement support for required options.

## 1.0.4

* Fix issue when instantiating Parameter instances with a number directly.

## 1.0.3

* Fix issue with quotation of multi word parameters. Thanks [@Page-](https://github.com/Page-)!

## 1.0.2

* Fix https://github.com/resin-io/capitano/issues/4.

## 1.0.1

* Fix issues with path and quoted multi string parameters.
