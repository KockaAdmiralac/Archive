#!/usr/bin/env node
/**
 * cli.js
 *
 * Entry point for command-line calls to Lux.
 */
'use strict';

/**
 * Importing modules.
 */
const fs = require('fs'),
      path = require('path'),
      os = require('os');

/**
 * Constants.
 */
const DATA_DIRECTORY = path.join(os.homedir(), '.lux');

/**
 * Lux CLI controller.
 */
class CLI {
    /**
     * Class constructor.
     */
    constructor() {
        fs.readdir(DATA_DIRECTORY, this._readdirCallback.bind(this));
    }
    /**
     * Callback from reading the .lux directory.
     * @param {Error} error Error that occurred
     * @param {Array<String>} files Files inside of the directory
     * @private
     */
    _readdirCallback(error, files) {
        if (error) {
            if (error.code === 'ENOENT') {
                fs.mkdir(DATA_DIRECTORY, this._createdDirectory.bind(this));
            } else {
                console.error(
                    'An error occurred while reading Lux data directory:',
                    error
                );
            }
        } else if (files.includes('lux.sock')) {
            console.error(
                'Something is already communicating with Lux daemon, exiting.'
            );
        } else if (files.includes('lux.pid')) {
            fs.readFile(
                path.join(DATA_DIRECTORY, 'lux.pid'),
                this._pidfileCallback.bind(this)
            );
        } else {
            this._startDaemon();
        }
    }
    /**
     * Callback after creating Lux's data directory.
     * @param {Error} error Error that occurred
     * @private
     */
    _createdDirectory(error) {
        if (error) {
            console.error(
                'An error occurred while creating the data directory:',
                error
            );
        } else {
            fs.mkdir(
                path.join(DATA_DIRECTORY, 'logs'),
                this._createdLogsDirectory.bind(this)
            );
        }
    }
    /**
     * Callback after creating Lux's logs directory.
     * @param {Error} error Error that occurred
     * @private
     */
    _createdLogsDirectory(error) {
        if (error) {
            console.error(
                'An error occurred while creating the logs directory:',
                error
            );
        } else {
            this._startDaemon();
        }
    }
    /**
     * Callback after reading lux.pid to find the daemon's process ID.
     * @param {Error} error Error that occurred
     * @param {Buffer} data Data from the pidfile
     */
    _pidfileCallback(error, data) {
        if (error) {
            //
        }
    }
}

module.exports = new CLI();
module.exports.start();
