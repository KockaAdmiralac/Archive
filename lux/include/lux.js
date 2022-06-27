/**
 * lux.js
 *
 * Module for controlling services.
 */
'use strict';

/**
 * Importing modules.
 */
const path = require('path'),
      ServiceData = require('./data.js');

/**
 * Constants.
 */
const SIGNALS = [
    'start',
    'stop',
    'restart',
    'pause',
    'update',
    'reset'
], PING = 1000;

/**
 * Main service controller - Lux.
 */
class Lux {
    /**
     * Class constructor.
     */
    constructor() {
        this._loadConfig();
        this._serviceQueue = {};
        this._waitingFor = {};
        this._methodCalls = {};
        this._signalCalls = {};
        this._currentCallback = 0;
    }
    /**
     * Starts Lux.
     */
    start() {
        this._registerServices();
        this._setupHealthcheck();
        process.title = 'lux';
    }
    /**
     * Loads the configuration.
     * @private
     */
    _loadConfig() {
        try {
            this._config = require(process.argv[2] || '../config.json');
        } catch (e) {
            console.error(
                'An error occurred while loading configuration!',
                e,
                'Exiting Lux...'
            );
            process.exit();
        }
    }
    /**
     * Creates service data to use when starting services.
     * and starts the services.
     * @private
     */
    _registerServices() {
        this._services = {};
        const {services, permissions} = this._config;
        if (!services || typeof services !== 'object') {
            console.error('No services registered! Exiting Lux...');
            process.exit();
        }
        for (const name in services) {
            const config = services[name],
                  p = path.resolve(
                      config && config.path ?
                        config.path :
                        `modules/${
                            config && config.name ? config.name : name
                        }`
                  ),
                  perms = typeof permissions === 'object' && permissions[name];
            let def = null;
            try {
                def = require(`${p}/main.json`);
            } catch (e) {
                console.error(`Failed to load definition for ${name}!`);
            }
            if (def && typeof def === 'object') {
                const service = new ServiceData(name, p, def, config, perms);
                if (service.autoStart) {
                    service.start(function(message) {
                        this._message(name, message);
                    }.bind(this));
                }
                this._services[name] = service;
            }
        }
    }
    /**
     * Connects a service.
     * @param {String} name Service name
     * @param {ServiceData} service Service data
     */
    _connectService(name, service) {
        this._debugLog(`Attempting to connect to ${name}...`);
        let connecting = true;
        service.dependencies.forEach(function(d) {
            if (!this._services[d].running) {
                this._serviceQueue[d] = this._serviceQueue[d] || [];
                this._serviceQueue[d].push(name);
                this._waitingFor[name] = this._waitingFor[name] || 0;
                ++this._waitingFor[name];
                connecting = false;
            }
        }, this);
        if (connecting) {
            this._debugLog(`Connecting to ${name}...`);
            service.connected();
        } else {
            this._debugLog(`${name} is waiting for dependencies...`);
        }
    }
    /**
     * Sets up ping check to ensure services are not dead.
     * @private
     */
    _setupHealthcheck() {
        this._healthcheckInterval = setInterval(
            this._healthcheck.bind(this),
            4 * PING
        );
    }
    /**
     * Checks ping of all services.
     * @private
     */
    _healthcheck() {
        for (const name in this._services) {
            const service = this._services[name];
            if (service.deadPing) {
                service.stop();
                // Give the service some time to normally stop.
                setTimeout(function() {
                    if (this._services[name]) {
                        service.kill();
                        delete this._services[name];
                    }
                }.bind(this), 4 * PING);
            }
        }
    }
    /**
     * Handles messages received from other services.
     * @param {String} name Service name
     * @param {Object|Boolean|Number|String|null} msg Received message
     */
    _message(name, msg) {
        if (typeof msg !== 'object' || typeof msg.action !== 'string') {
            this._debugLog(`Invalid message: ${JSON.stringify(msg)}`);
            return;
        }
        const service = this._services[name];
        if (!(service instanceof ServiceData)) {
            this._debugLog(`Invalid service: ${name}`);
            return;
        }
        switch (msg.action) {
            case 'connect':
                service.connect();
                break;
            case 'connected':
                if (msg.dependencies instanceof Array) {
                    service.dependencies = msg.dependencies;
                }
                this._connectService(name, service);
                break;
            case 'running':
                service.run();
                if (this._serviceQueue[name]) {
                    this._serviceQueue[name].forEach(function(s) {
                        if (--this._waitingFor[s] === 0) {
                            this._connectService(s, this._services[s]);
                            delete this._waitingFor[s];
                        }
                    }, this);
                    delete this._serviceQueue[name];
                }
                break;
            case 'ping':
                service.pong();
                break;
            case 'method':
                if (
                    typeof msg.callback === 'number' &&
                    typeof msg.method === 'string' &&
                    typeof msg.service === 'string' &&
                    this._services[msg.service] instanceof ServiceData
                ) {
                    const cb = ++this._currentCallback;
                    this._methodCalls[cb] = {
                        callback: cb,
                        called: msg.service,
                        service: name
                    };
                    this._services[msg.service]
                        .method(msg.method, cb, msg.args);
                }
                break;
            case 'methodResult':
                if (
                    typeof msg.callback === 'number' &&
                    typeof this._methodCalls[msg.callback] === 'object' &&
                    this._methodCalls[msg.callback].called === name &&
                    this._services[this._methodCalls[msg.callback].service]
                ) {
                    this._services[this._methodCalls[msg.callback].service]
                        .methodResult(
                            this._methodCalls[msg.callback].callback,
                            msg.response
                        );
                    delete this._methodCalls[msg.callback];
                }
                break;
            case 'signal':
                if (
                    SIGNALS.includes(msg.signal) &&
                    service.canSignal(msg.service) &&
                    this._services[msg.service]
                ) {
                    this._services[msg.service].signal(name, msg);
                }
                break;
            default:
                this._debugLog(`[${name}] Unknown action: ${msg.action}`);
                break;
        }
    }
    /**
     * Outputs text to console if in debug mode.
     * @private
     * @param {String} text Text to output
     */
    _debugLog(text) {
        if (this._config.debug) {
            console.log(text);
        }
    }
}

module.exports = Lux;
