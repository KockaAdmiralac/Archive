/**
 * data.js
 *
 * Module for storing service data.
 */
'use strict';

/**
 * Importing modules.
 */
const cp = require('child_process'),
      fs = require('fs');

/**
 * Constants.
 */
const PING = 1000;

/**
 * Represents service data and communication on the side of Lux.
 */
class ServiceData {
    /**
     * Class constructor.
     * @param {String} name Service name
     * @param {String} path Service path
     * @param {Object} def Service definition
     * @param {Object} config Service configuration
     * @param {Object} permissions Service permissions
     */
    constructor(name, path, def, config, permissions) {
        this._name = name;
        this._path = path;
        this._def = def;
        this._config = config;
        this._permissions = permissions;
        this._status = 0;
        this.dependencies = [];
    }
    /**
     * Waits for standard output and standard error streams to open
     * before starting the service.
     * @param {Function} listener Listener function for messages
     */
    start(listener) {
        this._streamsStarting = 2;
        if (typeof listener === 'function') {
            this._streamListener = listener;
        }
        this._stdout = fs.createWriteStream(`logs/${this._name}.out.log`, {
            flags: 'a'
        });
        this._stderr = fs.createWriteStream(`logs/${this._name}.err.log`, {
            flags: 'a'
        });
        this._stdout.once('open', this._start.bind(this));
        this._stderr.once('open', this._start.bind(this));
    }
    /**
     * Actually starts the service.
     * @private
     */
    _start() {
        if (--this._streamsStarting === 0) {
            this._process = cp.fork('service.js', [this._path], {
                stdio: ['ipc', this._stdout, this._stderr]
            });
            if (this._streamListener) {
                this._process.on('message', this._streamListener);
            }
            this._process.on('error', this._processError.bind(this));
            this._status = 1;
        }
    }
    /**
     * Connects the service to Lux.
     */
    connect() {
        if (this._process) {
            this._process.send({
                action: 'connect',
                config: this._config,
                def: this._def,
                name: this._name
            });
            this._status = 2;
        }
    }
    /**
     * Marks the service as connected.
     */
    connected() {
        if (this._process) {
            this._status = 2;
            this._process.send({
                action: 'connected'
            });
        }
    }
    /**
     * Marks the service as running.
     */
    run() {
        this._status = 3;
        this.pong();
    }
    /**
     * Pings the service.
     */
    ping() {
        if (this._process) {
            this._process.send({
                action: 'ping'
            });
        }
    }
    /**
     * Receives a pong from the service.
     */
    pong() {
        this._pong = Date.now();
        setTimeout(this.ping.bind(this), PING);
    }
    /**
     * Marks the service as dead.
     */
    stop() {
        this._status = 0;
    }
    /**
     * Forcibly kills the service.
     */
    kill() {
        if (this._process) {
            this._process.kill('SIGINT');
            this._process = null;
        }
    }
    /**
     * Calls a method of the service.
     * @param {String} method Method name
     * @param {Number} callback Callback number to send to Lux when finished
     * @param {Array} args Method arguments
     */
    method(method, callback, args) {
        if (this._process) {
            this._process.send({
                action: 'method',
                args,
                callback,
                method
            });
        }
    }
    /**
     * Relays a method response from another service.
     * @param {Number} callback Callback number
     * @param {*} result Other service's response
     */
    methodResult(callback, result) {
        if (this._process) {
            this._process.send({
                action: 'methodResult',
                callback,
                result
            });
        }
    }
    /**
     * An error in the process communication occurred.
     * @param {Error} error Error that occurred
     */
    _processError(error) {
        console.error(error, error.code);
    }
    /**
     * Checks if the process can send signals to another service.
     * @param {String} service Service name
     * @returns {Boolean} If the process can signal to another service
     */
    canSignal(service) {
        if (
            typeof this._permissions === 'object' &&
            this._permissions.signal instanceof Array &&
            this._permissions.signal.includes(service)
        ) {
            return true;
        }
        return false;
    }
    /**
     * Sends a signal from another service.
     * @param {String} service Service sending the signal
     * @param {Object} args Additional signal arguments
     */
    signal(service, args) {
        const msg = Object.assign({}, args);
        delete msg.service;
        msg.action = msg.signal;
        delete msg.signal;
        Object.assign(msg, args);
        msg._from = service;
    }
    /**
     * Gets the service name.
     * @returns {String} Service name
     */
    get name() {
        return this._name;
    }
    /**
     * Gets the service directory location.
     * @returns {String} Service path
     */
    get path() {
        return this._path;
    }
    /**
     * Gets if service should be auto-starting.
     * @returns {Boolean} If service should be auto-starting
     */
    get autoStart() {
        return this._def.autoStart && this._config.autoStart !== false;
    }
    /**
     * Gets if the service is dead.
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
     * Gets if the service's ping is dead.
     * @returns {Boolean} If the service's ping is dead
     */
    get deadPing() {
        return Date.now() - this._pong > 4 * PING;
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

module.exports = ServiceData;
