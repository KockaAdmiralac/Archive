/**
 * main.js
 * 
 * Module providing HTTP web servers
 */
'use strict';

/**
 * Importing modules
 */
const express = require('express'),
      parser = require('body-parser'),
      Service = require('../../include/service.js');

/**
 * Main class
 * @class HTTP
 */
class HTTP extends Service {
    /**
     * Class constructor
     * @constructor
     */
    constructor(definition, configuration, integrations) {
        super(definition, configuration, integrations);
        this._servers = {};
    }
    /**
     * To be used by integration for making webservers
     * @method makeServer
     * @param {Object} config Server configuration
     */
    makeServer(name, config) {
        const app = express();
        app.use(parser.json());
        app.use(parser.urlencoded({
            extended: true
        }));
        // config.secure
        app.listen(config.port);
        this._servers[name] = app;
        return app;
    }
    /**
     * To be used by integration for routing on already
     * existent webservers
     * @method routeServer
     * @param {String} name Webserver identifier
     */
    routeServer(name, service) {
        const router = new express.Router();
        if (this._servers[name]) {
            this._servers[name].use(`/${service}`, router);
        }
        return router;
    }
}

module.exports = HTTP;