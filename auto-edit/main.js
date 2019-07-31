'use strict';
const Bot = require('nodemw'),
      bot = new Bot('config.json'),
      fs = require('fs'),
      template = fs.readFileSync('template.txt').toString().trim()/*,
      pages = {} */;

let interval;

/*fs.readFileSync('list.txt').toString().split('\n').forEach(function(l) {
    if(l) {
        const split = l.trim().split(':');
        pages[split[0].trim()] = split[1].trim();
    }
});*/
const pages = fs.readFileSync('list.txt').toString().trim().split('\n');

function init() {
    console.log('Logged in!');
    interval = setInterval(doEdit, 10000);
}

function doEdit() {
    // const page = Object.keys(pages)[0];
    const page = pages.shift();
    if(!page || /*!pages[page] ||*/ page === 'undefined') {
        clearInterval(interval);
        console.log('Finished!');
        return;
    }
    console.log(`Editing File:${page}.jpg...`);
    console.log(template.replace(/<template>/g, page));
    bot.edit(`File:${page}.jpg`, template.replace(/<template>/g, page), 'Adding file description', true, () => console.log(`Added description to ${page}.jpg!`));
    /*bot.edit(
        `File:${page}`,
        template
            .replace('<name>', pages[page])
            .replace('<hash>', pages[page]
                .toLowerCase()
                .replace(/[\'\(\)\?"]/g, '')
                .replace(/  /g, ' ')
                .trim()
            ),
        'Adding file description',
        true,
        () => console.log(`Added description to ${page}!`)
    );*/
    // delete pages[page];
}

bot.logIn('KockaBot', '---', init);
