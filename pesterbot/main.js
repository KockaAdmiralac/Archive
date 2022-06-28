'use strict';
const fs = require('fs');
const {Client} = require('irc-upd');
const {idleUsers, onlineUsers} = require('./data.json')

function getRandomUser() {
    return onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
}

const interval = setInterval(function() {
    fs.writeFile('data.json', JSON.stringify({idleUsers, onlineUsers}, null, '    '), function(err) {
        if (err) {
            console.log('Unable to save list:', err);
        }
    });
}, 5000);

function addUser(user) {
    if (!onlineUsers.includes(user)) {
        onlineUsers.push(user);
    }
}

function removeUser(user) {
    if (onlineUsers.includes(user)) {
        onlineUsers.splice(onlineUsers.indexOf(user), 1);
    }
}

function markIdle(user) {
    if (!idleUsers.includes(user)) {
        idleUsers.push(user);
    }
}

function unmarkIdle(user) {
    if (idleUsers.includes(user)) {
        idleUsers.splice(idleUsers.indexOf(user), 1);
    }
}

function tryGetRandomUser(user) {
    let randomUser = null,
        tempRandomUser = null;
    while (!randomUser) {
        tempRandomUser = getRandomUser();
        if (!idleUsers.includes(tempRandomUser) && user !== tempRandomUser) {
            randomUser = tempRandomUser;
        }
    }
    console.log('Attempting', randomUser);
    bot.whois(randomUser, function(response) {
        if (!response || !response.user) {
            tryGetRandomUser(user);
        } else {
            console.log(`${user} has been served ${randomUser}.`);
            bot.notice(user, `!=${randomUser}`);
        }
    });
}

const bot = new Client(
    'irc.mindfang.org',
    'randomEncounter',
    {
        autoConnect: false,
        autoRejoin: true,
        autoRenick: true,
        channels: ['#pesterchum'],
        realName: 'Fake random encounters bot that might still work',
        // sasl: true,
        // secure: true,
        stripColors: true,
        userName: 'pcc31'
    }
)
.on('registered', function() {
    console.log('Registered to server.');
})
.on('notice', function(nick, to, text) {
    if (to !== bot.nick) {
        return;
    }
    console.log(`Command from ${nick}: ${text}`);
    switch (text.trim()) {
        case '!':
            // responds with `!=chumHandle` where chumHandle is one of the users from the list of random users
            addUser(nick);
            tryGetRandomUser(nick);
            break;
        case '?':
            // should respond with `?=y` or `?=n` depending on whether you are or aren't in the random users list
            if (onlineUsers.includes(nick)) {
                bot.notice(nick, '?=y');
            } else {
                bot.notice(nick, '?=n');
            }
            break;
        case '+':
            // responds with `+=k` or `-=k` and add or remove you from the random users list
            addUser(nick);
            bot.notice(nick, '+=k');
            break;
        case '-':
            removeUser(nick);
            bot.notice(nick, '-=k');
            break;
        case '~':
            markIdle(nick);
            bot.notice(nick, '~=k');
        case '*':
            unmarkIdle(nick);
            bot.notice(nick, '*=k');
            break;
    }
})
.on('ctcp-version', function(from, to) {
    if (to === bot.nick) {
        bot.notice(from, `VERSION pesterbot v0.0.1`);
    } else {
        console.log(`${from} sent a CTCP VERSION to ${to}.`);
    }
})
.on('nick', function(oldnick, newnick, channels) {
    if (onlineUsers.includes(oldnick)) {
        addUser(newnick);
    }
})
.on('error', function(message) {
    if (message && message.command !== 'err_nosuchnick') {
        console.error('An IRC error occurred:', message);
    }
})
.on('netError', function(exception) {
    console.error('A socket error occurred:', exception);
});

process.on('SIGINT', function() {
    clearInterval(interval);
    bot.disconnect('rip random encounters.');
});

/**
 * Connect to IRC.
 */
bot.connect();

