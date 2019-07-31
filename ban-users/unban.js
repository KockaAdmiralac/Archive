const http = require('request-promise-native'),
      niccs = require('./nicks.json'),
      nicks = Object.keys(niccs),
      fs = require('fs'),
      config = require('./config.json');

function apiCall() {
    const nick = nicks.shift();
    if (!nick) {
        console.log('Y\'all\'ve been unbanned');
        return;
    }
    http({
        method: 'PATCH',
        uri: `https://discordapp.com/api/guilds/${config.id}/members/${nick}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.authorization
        },
        body: {
            nick: niccs[nick] === null ? '' : niccs[nick]
        },
        json: true
    }).then(function(d) {
        console.log(d);
        setTimeout(apiCall, 1000);
    }).catch(function(e) {
        console.log(e);
        console.log(nick);
    });
}

apiCall();
