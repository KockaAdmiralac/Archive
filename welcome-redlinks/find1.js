'use strict';
const Bot = require('nodemw'),
      bot = new Bot('config.json'),
      fs = require('fs'),
      pages = fs.readFileSync('source.txt').toString().split('\n'),
      cache = {},
      regex = /auf der Seite \[\[:?([^\|\]]+)(?:\||\])/g;
let res = [], res2 = [];

function init() {
    console.log('Logged in!');
    setInterval(interval, 5000);
    contents();
}

function interval() {
    console.log(pages.length + ': ' + res2.length + ' === ' + res.length);
    fs.writeFileSync('res1.txt', res.join('\n'));
    fs.writeFileSync('res2.txt', res2.join('\n'));
}

function contents(err, data) {
    if (err) {
        console.error(err);
        return;
    } else if (data) {
        for (let i in data.pages) {
            const page = data.pages[i],
                  revs = page.revisions;
            if (!revs || !revs[0]) {
                console.log('---------------------------------- title wrong ---------------------------------------------');
                console.log(page.title);
                continue;
            }
            const text = revs[0]['*'];
            if (text.startsWith('#WEITERLEITUNG')) {
                continue;
            }
            const stuff = regex.exec(text);
            regex.lastIndex = 0;
            if (!stuff) {
                console.log('---------------------------------- content wrong -------------------------------------------');
                console.log(text);
            } else {
                res.push(page.title);
                res2.push(stuff[1]);
            }
        }
    }
    if (pages.length === 0) {
        console.log('Finished!');
        return;
    }
    bot.api.call({
        action: 'query',
        titles: pages.splice(0, 50).join('|'),
        prop: 'revisions',
        rvprop: 'content'
    }, contents);
}

bot.logIn('KockaBot', '---', init);
