'use strict';
const data = require('./output.json');

let users = {};

data.map(el => el.author).forEach(function(el) {
    users[el.id] = `${el.username}#${el.discriminator}`;
});

console.log('```All messages:', data.length, '\nUnique users:', Object.keys(users).length, '```');
