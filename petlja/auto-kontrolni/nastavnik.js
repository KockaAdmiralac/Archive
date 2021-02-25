/**
 * nastavnik.js
 *
 * Teacher-side of petlja-auto-kontrolni.
 */
'use strict';

/**
 * Importing modules.
 */
const http = require('http'),
      readline = require('readline'),
      open = require('open'),
      {Client} = require('petlja'),
      polo = require('polo');

/**
 * Constants.
 */
const apps = polo({
          heartbeat: 10 * 1000,
          multicast: false
      }),
      cli = readline.createInterface({
          historySize: 0,
          input: process.stdin,
          output: process.stdout
      }),
      client = new Client(),
      groups = {};

/**
 * Global variables.
 */
let availableAccounts = [],
    url = '',
    server = null;

/**
 * Overrides the default CLI output with the ability to mute it.
 * @param {String} text Text to write to the output
 */
cli._writeToOutput = function(text) {
    if (!cli.password) {
        cli.output.write(text);
    }
};

/**
 * Asks the user a question.
 * @param {String} text Question to ask
 * @param {Boolean} password Whether a password is being entered
 * @returns {Promise} Promise to listen on for response
 */
function question(text, password) {
    return new Promise(function(resolve) {
        cli.question(`${text}: `, resolve);
        cli.password = password;
    });
}

/**
 * Main function of the teacher module.
 */
async function main() {
    const username = await question('Your Petlja username/e-mail'),
          password = await question('Your Petlja password', true);
    cli.password = false;
    console.info('\nAttempting to log into Petlja...');
    client.login(username, password);
}

/**
 * Handles HTTP server requests.
 * @param {IncomingMessage} request HTTP request information
 * @param {ServerResponse} response HTTP response interface
 */
function httpServer(request, response) {
    const account = availableAccounts.pop();
    if (account) {
        response.end(JSON.stringify({
            ...account,
            url
        }));
    } else {
        response.writeHead(404);
        response.end();
    }
}

/**
 * Callback after listening on the first available port.
 */
function httpListen() {
    const {port} = server.address();
    apps.put({
        name: 'petlja-auto-kontrolni',
        port
    });
    console.info(port);
}

/**
 * Creates managed accounts for use during the competition.
 * @param {Number} students Amount of accounts to create
 * @param {String} prefix Account prefix
 * @param {String} group Account group name
 */
async function createAccounts(students, prefix, group) {
    await client.cpanel.createAccounts(students, -1, prefix, group);
    const accounts = await client.cpanel.accounts(-1),
          groupIDs = [];
    accounts.forEach(function({id, password, userName, userSetId}) {
        if (!groups[userSetId]) {
            groups[userSetId] = [];
            groupIDs.push(userSetId);
        }
        groups[userSetId].push({
            id,
            password,
            username: userName
        });
    });
    const groupID = Math.max(...groupIDs);
    availableAccounts = groups[groupID].slice(0);
    return groupID;
}

/**
 * Callback after logging into Petlja.
 */
async function login() {
    const name = await question('Competition name');
    url = await question('Competition URL');
    const description = await question('Competition description'),
          students = Number(await question('Number of students')),
          prefix = await question('Student account prefix'),
          group = await question('Student group name');
    await client.cpanel.createCompetition({
        description,
        name,
        noEnd: '1',
        startDate: new Date().toISOString(),
        url
    });
    const groupID = await createAccounts(students, prefix, group);
    const competition = await client.arena.byUrl(url);
    if (competition) {
        /*
         * await client.cpanel.addCompetitor({
         *     competitionId: competition.id,
         *     groupId: groupID,
         *     initialBonusPenalty: -1,
         *     pageNo: 1,
         *     pageSize: 10
         * });
         */
        await open(`https://petlja.org/cpanel/CompetitionParticipants/${competition.id}`);
        await question('Press Enter to broadcast the competition');
        server = http.createServer(httpServer);
        server.listen(0, httpListen);
        await question('Press Enter to stop broadcasting the competition');
        apps.stop();
        server.close();
        await Promise.all(
            groups[groupID].map(({id}) => client.cpanel.deleteUser(id))
        );
        process.exit();
    } else {
        console.error('An error occurred while creating the competition.');
        process.exit();
    }
}

/**
 * Callback after the Petlja client receives an error.
 * @param {Object} error Received Petlja client error
 */
function petljaError(error) {
    console.info('Petlja client received an error:', error);
    process.exit();
}

client
    .on('login', login)
    .on('error', petljaError);

main();
