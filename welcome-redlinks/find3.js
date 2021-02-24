'use strict';
const Bot = require('nodemw'),
      bot = new Bot('config.json'),
      fs = require('fs'),
      pages = fs.readFileSync('res3.txt').toString().split('\n');
let res = [];

function ids(err, data) {
    if (err) {
        console.error(err);
        return;
    } else if (data) {
        res = res.concat(Object.keys(data.pages));
    }
    if (pages.length === 0) {
        fs.writeFileSync('res4.txt', res.join('\n'));
        console.log('Finished!');
        return;
    }
    bot.api.call({
        action: 'query',
        titles: pages.splice(0, 50).join('|')
    }, ids);
}

bot.logIn('KockaBot', require('./config.json').password, () => ids());
