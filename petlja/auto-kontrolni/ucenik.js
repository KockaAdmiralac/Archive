/**
 * ucenik.js
 *
 * Student-side of petlja-auto-kontrolni.
 */
'use strict';

/**
 * Importing modules.
 */
const readline = require('readline'),
      open = require('open'),
      polo = require('polo'),
      http = require('request-promise-native');

/**
 * Callback after receiving the teacher's address.
 * @param {String} address Teacher's address
 */
async function query({address}) {
    try {
        const response = JSON.parse(await http.get(`http://${address}`));
        console.log(`Username: ${response.username}\nPassword: ${response.password}`);
        await open(`https://arena.petlja.org/competition/${response.url}`);
    } catch (error) {
        if (error.statusCode === 404) {
            console.error('Service has no more available accounts!');
        } else {
            console.error('Service error:', error.error);
        }
    }
}

polo().once('petlja-auto-kontrolni/up', query);
readline.createInterface({
    input: process.stdin,
    output: process.stdout
}).question(
    'Enter server IP:port if broadcasting fails here: ',
    address => query({address})
);
