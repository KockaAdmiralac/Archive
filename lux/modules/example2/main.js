/**
 * main.js
 *
 * Main service script.
 */
'use strict';

/**
 * Importing modules.
 */
const Service = require('../../include/service.js');

/**
 * Main service class.
 */
class ExampleService2 extends Service {
    /**
     * Starts the service.
     * @returns {*} False if service failed to start, null otherwise
     */
    start() {
        if (super.start() === false) {
            return false;
        }
        console.log('Service successfully started after service 1!');
        this.method(
            this._config.dep,
            'exampleMethod',
            this._exampleCallback.bind(this),
            'Example argument from service 2!'
        );
        return null;
    }
    /**
     * Callback from an example method call.
     * @param {String} example Result of the example method call
     */
    _exampleCallback(example) {
        console.info(
            'Service 2 received an example response with an argument',
            example
        );
    }
    /**
     * Gets service dependencies.
     * @returns {Array<String>} Service dependencies
     */
    get dependencies() {
        if (typeof this._config.dep === 'string') {
            return [this._config.dep];
        }
        return [];
    }
}

module.exports = ExampleService2;
