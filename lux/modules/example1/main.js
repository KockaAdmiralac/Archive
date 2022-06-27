/**
 * main.js
 *
 * Main service script
 */
'use strict';

/**
 * Importing modules
 */
const Service = require('../../include/service.js');

/**
 * Main service class
 */
class ExampleService1 extends Service {
    /**
     * Starts the service
     * @returns {*} False if service failed to start, null otherwise
     */
    start() {
        if (super.start() === false) {
            return false;
        }
        console.log('Service successfully started!');
        return null;
    }
}

module.exports = ExampleService1;
