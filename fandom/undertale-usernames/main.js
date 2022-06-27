'use strict';
const config = require('./config.json'),
    http = require('request-promise-native'),
    fs = require('fs'),
    input = require('./in.json');

let data = require('./data.json'),
    messages = [],
    interval;

function post() {
    if(messages.length === 0) {
        clearInterval(interval);
        return;
    }
    http({
        method: 'POST',
        uri: `https://discordapp.com/api/webhooks/${config.id}/${config.token}`,
        body: {
            content: messages.splice(0, 1)[0]
        },
        json: true
    });
}

for(let i in input) {
    if(input.hasOwnProperty(i)) {
        let name = input[i];
        data[i] = name;
        messages.push(`<@${i}> - [${name}](<http://undertale.wikia.com/wiki/Special:Contributions/${encodeURIComponent(name)}>)`);
    }
}

fs.writeFileSync('data.json', JSON.stringify(data));

interval = setInterval(post, config.interval || 1000);
