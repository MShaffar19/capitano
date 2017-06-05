/*
 * Copyright 2017 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const _ = require('lodash');
const validate = require('./validate');
const Parameter = require('./parameter');
const words = require('./words');

/**
 * @summary Signature class
 * @public
 * @class
 */
class Signature {

  /**
   * @summary Create an instance of Signature
   * @name Signature
   * @class
   * @public
   *
   * @param {Object} options - options
   * @param {String[]} options.command - signature command words
   * @param {Object[]} [options.parameters] - signature command parameters
   *
   * @example
   * const signature = new Signature({
   *   command: [ 'foo', 'bar' ],
   *   parameters: [
   *     new Parameter({
   *       name: 'baz',
   *       type: [ 'string' ],
   *       description: 'baz parameter',
   *       optional: true
   *     })
   *   ]
   * });
   */
  constructor(options) {
    if (!validate.isOptionsObjectValid(options)) {
      throw new Error(`Invalid signature: ${options}`);
    }

    if (!validate.isCommandValid(options.command)) {
      throw new Error(`Invalid signature command: ${options.command}`);
    }

    _.defaults(options, {
      parameters: []
    });

    if (!validate.isParametersValid(options.parameters)) {
      throw new Error(`Invalid signature parameters: ${options.parameters}`);
    }

    // TODO: Move to validate.js

    const firstOptionalIndex = _.findIndex(options.parameters, Parameter.isOptional);
    const requiredIndexAfterOptional = _.findIndex(options.parameters, Parameter.isRequired, firstOptionalIndex);
    const INDEX_NOT_FOUND = -1;
    if (firstOptionalIndex !== INDEX_NOT_FOUND && requiredIndexAfterOptional > firstOptionalIndex) {
      throw new Error('Invalid signature parameters: required parameter after an optional parameter');
    }

    const firstVariadicIndex = _.findIndex(options.parameters, Parameter.isVariadic);
    const INDEX_SIZE_DIFFERENCE = 1;
    if (firstVariadicIndex !== INDEX_NOT_FOUND && firstVariadicIndex !== _.size(options.parameters) - INDEX_SIZE_DIFFERENCE) {
      throw new Error('Invalid signature parameters: parameter after a variadic parameter');
    }

    this.command = _.map(options.command, _.trim);
    this.parameters = options.parameters;
  }

  /**
   * @summary Convert Signature to String
   * @method
   * @public
   * @returns {String} string representation
   *
   * @example
   * const signature = new Signature({
   *   command: [ 'foo', 'bar' ],
   *   parameters: [
   *     new Parameter({
   *       name: 'baz',
   *       type: [ 'string' ],
   *       description: 'baz parameter',
   *       optional: true
   *     })
   *   ]
   * });
   *
   * console.log(signature.toString());
   * > 'foo bar [bar]'
   */
  toString() {
    return _.chain(this.command)
      .concat(_.invokeMap(this.parameters, 'toString'))
      .join(' ')
      .value();
  }

}

/**
 * @summary Match a set of arguments against a signature
 * @function
 * @public
 *
 * @param {Object} signature - signature
 * @param {String[]} argv - arguments
 * @returns {(Object|Null)} matched arguments
 *
 * @example
 * const signature = new Signature({
 *   command: [ 'foo', 'bar' ],
 *   parameters: [
 *     new Parameter({
 *       name: 'baz',
 *       type: [ 'string' ],
 *       description: 'baz parameter',
 *       optional: true
 *     })
 *   ]
 * });
 *
 * const result = Signature.match(signature, [ 'foo', 'bar', 'value' ]);
 * console.log(result);
 * > {
 * >   baz: 'value'
 * > }
 */
Signature.match = (signature, argv) => {
  if (!_.isEqual(_.take(argv, _.size(signature.command)), signature.command)) {
    return null;
  }

  const args = _.slice(argv, _.size(signature.command));

  const matches = _.reduce(signature.parameters, (accumulator, parameter, index) => {
    const parameters = Parameter.isVariadic(parameter)
      ? _.slice(args, index)
      : _.compact([ _.nth(args, index) ]);
    accumulator.arguments += _.size(parameters);

    if (!Parameter.matches(parameter, parameters)) {
      accumulator.mismatch = true;
      return accumulator;
    }

    const evaluateWord = _.partial(words.evaluate, parameter.type);
    const value = Parameter.isVariadic(parameter)
      ? _.map(parameters, evaluateWord)
      : evaluateWord(_.first(parameters));

    _.set(accumulator.object, [ parameter.name ], value);
    return accumulator;
  }, {
    object: {},
    arguments: 0,
    mismatch: false
  });

  if (_.some([
    !_.isEmpty(matches.object) && _.size(_.keys(matches.object)) < _.size(signature.parameters),
    matches.arguments < _.size(args),
    matches.mismatch
  ])) {
    return null;
  }

  return matches.object;
};

module.exports = Signature;