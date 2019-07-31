/**
 * main.js
 *
 * Main entry point for the project.
 */
'use strict';

/**
 * Importing modules.
 */
const {spawn} = require('child_process'),
      fs = require('fs').promises,
      https = require('https'),
      path = require('path'),
      express = require('express'),
      parser = require('body-parser'),
      config = require('./config.json');

/**
 * Constants.
 */
const app = express(),
      CERTS = ['cert', 'key'];

/**
 * Global variables.
 */
let server = null,
    // TODO: Not very thread-safe.
    notfound = false;

/**
 * Reads a certificate file.
 * @param {String} file Filename of the certificate file
 * @returns {Promise} Promise to listen on when the file is read
 */
function readCertFile(file) {
    return fs.readFile(`${__dirname}/keys/${file}.pem`, {
        encoding: 'utf-8'
    });
}

/**
 * Sets up the web server.
 * @param {Array<String>} contents Contents of the certificate files
 * @returns {Promise} Promise to listen on for response
 */
function setupServer(contents) {
    return new Promise(function(resolve, reject) {
        const options = {
            passphrase: config.passphrase
        };
        CERTS.forEach(function(cert, index) {
            options[cert] = contents[index];
        });
        try {
            server = https.createServer(options, app)
                .listen(config.port || 443);
            resolve();
        } catch (error) {
            reject(error);
            process.exit();
        }
    });
}

/**
 * Callback after the tmux session closes.
 * @param {Function} resolve Function to call when closing succeeds
 * @param {Function} reject Function to call when closing fails
 * @param {Number} code Exit code of the command
 */
function onTmuxClose(resolve, reject, code) {
    if (code === 0 || notfound) {
        notfound = false;
        resolve();
    } else {
        reject(code);
    }
}

/**
 * Sets up a new tmux session.
 * @returns {Promise} Promise to listen on for response
 */
function startTmux() {
    return new Promise(function(resolve, reject) {
        const child = spawn('tmux', [
            'new-session',
            '-d',
            '-s',
            'dimitrije',
            `java -Xmx1024M -Xms1024M -jar ${path.join(
                __dirname,
                'bin/server.jar'
            )} nogui`
        ]);
        child.stdout.on('data', output => console.info(
            'tmux output:',
            output.toString().trim()
        ));
        child.stderr.on('data', error => console.error(
            'tmux error:',
            error.toString().trim()
        ));
        child.on('exit', onTmuxClose.bind(null, resolve, reject));
    });
}

/**
 * Handles error output from the tmux stopping command.
 * @param {Buffer} error Error that occurred
 */
function stopTmuxError(error) {
    const err = error.toString().trim();
    if (
        err === 'can\'t find session dimitrije' ||
        err.startsWith('no server running on ')
    ) {
        notfound = true;
    } else {
        console.error(err);
    }
}

/**
 * Stops the tmux session.
 * @returns {Promise} Promise to listen on for response
 * @todo DRY
 */
function stopTmux() {
    return new Promise(function(resolve, reject) {
        const child = spawn('tmux', [
            'kill-session',
            '-t',
            'dimitrije'
        ]);
        child.stdout.on('data', output => console.info(
            'tmux output:',
            output.toString().trim()
        ));
        child.stderr.on('data', stopTmuxError);
        child.on('exit', onTmuxClose.bind(null, resolve, reject));
    });
}

/**
 * Callback after restarting the server.
 * @param {express.Response} response Response interface
 */
function restartCallback(response) {
    response.json({
        success: true
    });
}

/**
 * Restarts the server.
 * @param {express.Request} request Request interface
 * @param {express.Response} response Response interface
 */
function restart(request, response) {
    if (
        typeof request.body === 'object' &&
        typeof request.body.token === 'string' &&
        request.body.token === config.token
    ) {
        stopTmux()
            .then(startTmux)
            .then(restartCallback.bind(null, response));
    } else {
        response.status(400).json({
            error: true,
            info: 'Invalid request.'
        });
    }
}

/**
 * Closes the server and stops the application.
 */
function finish() {
    console.info(`${String.fromCharCode(27)}[0GFinishing session...`);
    server.close();
    stopTmux();
}

/**
 * Set up web server.
 */
app.use(parser.json());
app.use(parser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.post('/restart', restart);
Promise.all(CERTS.map(readCertFile))
    .then(setupServer)
    .then(startTmux)
    .then(() => console.info('Started tmux.'));
process.on('SIGINT', finish);
