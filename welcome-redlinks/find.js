'use strict';
const Bot = require('nodemw'),
      bot = new Bot('config.json'),
      fs = require('fs');

let res = [];

function init() {
    console.log('Logged in!');
    list();
}

function list(err, data, next) {
    if (err) {
        console.log(err);
        return;
    } else if (data) {
        res = res.concat(data.map(d => d.title));
        if (!next) {
            fs.writeFileSync('res.txt', res.join('\n'));
            return;
        }
    }
    bot.getUserContribs({
        user: 'FANDOM',
        namespace: 1201,
        start: next
    }, list);
}

bot.logIn('KockaBot', '---', init);
