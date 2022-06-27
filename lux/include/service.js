/**
 * service.js
 *
 * Base module for services.
 */
'use strict';

/**
 * Constants.
 */
const PING = 1000;

/**
 * Base class for services.
 */
class Service {
    /**
     * Class constructor
     * @param {Object} definition Service definition
     * @param {Object} configuration Service configuration
     */
    constructor() {
        this._status = 1;
        this._dir = process.argv[2];
        this._methodCallbacks = {};
        this._methodCounter = 0;
    }
    /**
     * Starts the service.
     * @returns {*} False if service failed to start, null otherwise
     */
    start() {
        if (this.running) {
            this._signalError = 'running';
            return false;
        }
        this._status = 3;
        process.send({
            action: 'running'
        });
        return null;
    }
    /**
     * Stops the service.
     * @returns {*} False if service failed to stop, null otherwise
     */
    stop() {
        if (this.dead) {
            this._signalError = 'stopped';
            return false;
        }
        return null;
    }
    /**
     * Restarts the service.
     * @returns {*} False if service failed to restart, null otherwise
     */
    restart() {
        return null;
    }
    /**
     * Pauses the service.
     * @returns {*} False if service failed to pause, null otherwise
     */
    pause() {
        if (!this.running) {
            this._signalError = 'notRunning';
            return false;
        }
        return null;
    }
    /**
     * Updates the service.
     * @returns {*} False if service failed to update, null otherwise
     */
    update() {
        return null;
    }
    /**
     * Reloads the service configuration.
     * @returns {*} False if service failed to reload, null otherwise
     */
    reload() {
        return null;
    }
    /**
     * Resets service data.
     * @returns {*} False if service failed to reset, null otherwise
     */
    reset() {
        return null;
    }
    /**
     * Connects the service to Lux.
     */
    connect() {
        process.on('message', this._message.bind(this));
        process.send({
            action: 'connect'
        });
        this._status = 2;
    }
    /**
     * Sends an ACK after receiving configuration and definition.
     */
    connected() {
        process.send({
            action: 'connected',
            dependencies: this.dependencies
        });
    }
    /**
     * Registers methods from the definition.
     */
    _registerMethods() {
        if (!(this._def.methods instanceof Array)) {
            return;
        }
        try {
            const MethodHandler = require(`${this._dir}/methods.js`);
            this._handler = new MethodHandler(this);
            this._methods = this._def.methods
                .filter(m => typeof this._handler[m] === 'function');
            if (this._def.methods.length !== this._methods.length) {
                console.error('Nonexistent methods present in definition!');
            }
        } catch (e) {
            console.error('Failed to load method handler!', e);
        }
    }
    /**
     * Calls a method from another service.
     * @param {String} service Service whose method to call
     * @param {String} method Method name
     * @param {Function} cb Function to call after the method finished
     * @param {Array} args Arguments for the method
     */
    method(service, method, cb, ...args) {
        const callback = ++this._methodCounter;
        this._methodCallbacks[callback] = cb;
        process.send({
            action: 'method',
            args,
            callback,
            method,
            service
        });
        if (this._methodCounter === Number.MAX_SAFE_INTEGER) {
            this._methodCounter = 0;
        }
    }
    /**
     * Responds to a method call.
     * @param {Number} callback Callback number of the method
     * @param {*} response Method response
     */
    methodResponse(callback, response) {
        process.send({
            action: 'methodResult',
            callback,
            response
        });
    }
    /**
     * Receives messages sent by Lux.
     * @param {Object|Boolean|Number|String|null} msg Received message
     * @private
     */
    _message(msg) {
        if (typeof msg !== 'object' || typeof msg.action !== 'string') {
            console.error('Invalid message:', msg);
            return;
        }
        switch (msg.action) {
            case 'connect':
                this._config = msg.config;
                this._def = msg.def;
                this._name = msg.name;
                process.title = `lux-${this._name}`;
                this._registerMethods();
                this.connected();
                break;
            case 'connected':
                this.start();
                break;
            case 'ping':
                setTimeout(this.ping.bind(this), PING);
                break;
            case 'method':
                if (
                    typeof msg.method === 'string' &&
                    typeof msg.callback === 'number'
                ) {
                    const args = msg.args instanceof Array ? msg.args : [];
                    if (this._methods.includes(msg.method)) {
                        this._handler[msg.method](msg.callback, ...args);
                    }
                    // TODO: Respond with an error if there is no such method.
                }
                break;
            case 'methodResult':
                if (typeof msg.callback === 'number') {
                    const callback = this._methodCallbacks[msg.callback];
                    if (typeof callback === 'function') {
                        callback(msg.result);
                    }
                    delete this._methodCallbacks[msg.callback];
                }
                break;
            case 'signal':
                break;
            default:
                console.error('Invalid action');
                break;
        }
    }
    /**
     * Pongs Lux.
     * @private
     */
    ping() {
        process.send({
            action: 'ping'
        });
    }
    /**
     * Gets if the service is auto-starting.
     * @returns {Boolean} If the service is auto-starting
     */
    get autoStart() {
        return this._autoStart;
    }
    /**
     * Gets if the service is dead.
     * This should never happen.
     * @returns {Boolean} If the service is dead
     */
    get dead() {
        return this._status === 0;
    }
    /**
     * Gets if the service is starting.
     * @returns {Boolean} If the service is starting
     */
    get starting() {
        return this._status === 1;
    }
    /**
     * Gets if the service is connecting.
     * @returns {Boolean} If the service is connecting
     */
    get connecting() {
        return this._status === 2;
    }
    /**
     * Gets if the service is running.
     * @returns {Boolean} If the service is running
     */
    get running() {
        return this._status === 3;
    }
    /**
     * Gets if the service is paused.
     * @returns {Boolean} If the service is paused
     */
    get paused() {
        return this._status === 4;
    }
    /**
     * Gets service dependencies.
     * @returns {Array<String>} Service dependencies
     */
    get dependencies() {
        return [];
    }
    /**
     * Gets the service type.
     * @returns {String} Service name
     */
    get type() {
        return this._def.name;
    }
    /**
     * Gets the service description.
     * @returns {String} Service description
     */
    get description() {
        return this._def.description;
    }
    /**
     * Gets the service version.
     * @returns {Array<Number>} Service version [MAJOR, MINOR, PATCH]
     */
    get version() {
        return this._def.version;
    }
}

module.exports = Service;
