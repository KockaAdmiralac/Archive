'use strict';
const Bot = require('nodemw'),
      bot = new Bot('config.json'),
      fs = require('fs'),
      pages = fs.readFileSync('res1.txt').toString().split('\n'),
      links = fs.readFileSync('res2.txt').toString().split('\n'),
      res = {};
let res2 = [];

pages.forEach(function(el, i) {
    const link = links[i];
    if (link.startsWith('Thread:') || link.startsWith('User:')) {
        return;
    }
    if (!res[link]) {
        res[link] = [];
    }
    res[link].push(el);
});

const keys = Object.keys(res);

function contents(err, data) {
    if (err) {
        console.error(err);
        return;
    } else if (data) {
        for (let i in data.pages) {
            if (Number(i) < 0) {
                console.log()
                res2 = res2.concat(res[data.pages[i].title]);
            }
        }
    }
    if (keys.length === 0) {
        fs.writeFileSync('res3.txt', res2.join('\n'));
        console.log('Finished!');
        return;
    }
    bot.api.call({
        action: 'query',
        titles: keys.splice(0, 50).join('|'),
        prop: 'revisions',
        rvprop: ''
    }, contents);
}

bot.logIn('KockaBot', '---', contents);
