'use strict';
const http = require('request-promise-native'),
    fs = require('fs'),
    readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

let array = [], channelID, userToken;

function fetch(before) {
    http({
        headers: {
            'Authorization': userToken
        },
        method: 'GET',
        uri: `https://discordapp.com/api/channels/${channelID}/messages`,
        qs: {
            // token: userToken,
            before: before,
            limit: 100
        },
        json: true
    }).then(function(d) {
        array = array.concat(d);
        if(d.length < 100) {
            console.log('Written to output.');
            fs.writeFileSync('output.json', JSON.stringify(array));
            readline.close();
        } else {
            let last = d[d.length - 1];
            console.log(`Got up to ${new Date(last.timestamp).toLocaleString()}`);
            fetch(last.id);
        }
    }).catch(function(e) {
        console.log('Timeout! Retrying...', e);
        fetch(before);
    });
}

readline.question('Enter channel ID: ', function(id) {
    channelID = id;
    readline.question('Enter your token: ', function(token) {
        userToken = token;
        fetch();
    });
});
