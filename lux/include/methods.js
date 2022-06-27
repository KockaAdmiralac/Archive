/**
 * methods.js
 *
 * Handles method calls in services.
 */
'use strict';

/**
 * Base method handler.
 */
class MethodHandler {
    /**
     * Class constructor.
     * @param {Service} service Service whose methods are being handled
     */
    constructor(service) {
        this._service = service;
    }
    /**
     * Handles method response.
     * @param {Number} callback Callback number of the method
     * @param {*} response Method response
     */
    respond(callback, response) {
        this._service.methodResponse(callback, response);
    }
}

module.exports = MethodHandler;
