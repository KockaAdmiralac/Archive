const http = require('request-promise-native'),
      nicks = {},
      fs = require('fs'),
      config = require('./config.json');

function apiCall(after) {
    const qs = {
        token: config.token,
        limit: 100
    };
        qs.after = after;
    if (after) {
    }
    http({
        method: 'GET',
        uri: `https://discordapp.com/api/guilds/${config.id}/members`,
        qs,
        json: true
    }).then(function(d) {
        if (d.length === 0) {
            fs.writeFileSync('nicks.json', JSON.stringify(nicks, null, '    '));
            return;
        }
        d.forEach(user => nicks[user.user.id] = user.nick);
        console.log(d);
        apiCall(d[d.length - 1].user.id);
    }).catch(function(e) {
        console.log(e);
        fs.writeFileSync('nicks.json', JSON.stringify(nicks, null, '    '));
    });
}

apiCall();
