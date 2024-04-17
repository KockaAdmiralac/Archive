'use strict';
const data = require('./output.json').reverse(),
    fs = require('fs');

let allUsers = data.map(el => el.author),
    lines = '',
    users = {};

allUsers.forEach(function(el) {
    users[el.id] = `${el.username}#${el.discriminator}`;
});

data.forEach(function(el) {
    let content = el.content,
        author = el.author;
    if(el.mentions) {
        content = content.replace(/<@[!]*(\d+)>/g, (_, id) => `@${users[id]}`);
    }
    lines += `[${new Date(el.timestamp).toLocaleString()}] <${author.username}#${author.discriminator}> ${content}\n`;
});

fs.writeFileSync('log.txt', lines);
