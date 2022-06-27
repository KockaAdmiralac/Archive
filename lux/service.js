/**
 * service.js
 *
 * Script that starts subservices.
 */
'use strict';

/**
 * Constants.
 */
const path = process.argv[2];

if (path) {
    try {
        // TODO: CHECK IF SUBSERVICE EXTENDS SERVICE.
        const Subservice = require(`${path}/main.js`);
        const service = new Subservice();
        service.connect();
    } catch (e) {
        console.error(`Subservice ${path} failed to load!`, e);
    }
} else {
    console.error('Path to module not specified!');
}
