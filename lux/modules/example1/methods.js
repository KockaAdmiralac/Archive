/**
 * methods.js
 *
 * Module for handling method calls.
 */
'use strict';

/**
 * Importing modules.
 */
const MethodHandler = require('../../include/methods.js');

/**
 * Handles method calls from other services.
 */
class ExampleMethodHandler1 extends MethodHandler {
    /**
     * Example method.
     * @param {Number} callback Callback number
     * @param {String} example Example argument
     */
    exampleMethod(callback, example) {
        console.info(
            'Service 1 received an example method call with an argument',
            example
        );
        this.respond(callback, 'Hello from example service 1!');
    }
}

module.exports = ExampleMethodHandler1;
