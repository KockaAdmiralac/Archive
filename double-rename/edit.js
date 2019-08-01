'use strict';
const http = require('request-promise-native'),
      data = require('./found.json'),
      wikis = Object.keys(data),
      tokens = {},
      errors = {},
      config = require('./config.json'),
      jar = http.jar(),
      fs = require('fs');
let interval;

function getToken(wiki, page) {
    console.log('Getting token for', wiki, '...');
    http({
        method: 'GET',
        uri: `http://${wiki}.wikia.com/api.php`,
        headers: {
            'User-Agent': 'Neutral edit summary maker'
        },
        qs: {
            action: 'query',
            titles: '#',
            prop: 'info',
            intoken: 'edit',
            format: 'json'
        },
        jar,
        json: true
    }).then(function(d) {
        if (d && d.query && d.query.pages && d.query.pages[-1] && d.query.pages[-1].edittoken) {
            tokens[wiki] = d.query.pages[-1].edittoken;
            doEdit(wiki, page);
        } else {
            console.log(`Error occurred while fetching token for ${wiki}`);
            errors[`${wiki}:token`] = true;
        }
    }).catch(function(e) {
        console.log(`Error occurred while fetching token for ${wiki}`);
        errors[`${wiki}:token`] = e;
    });
}

function doEdit(wiki, page) {
    console.log('Editing', page, 'on', wiki, '...');
    http({
        method: 'POST',
        uri: `http://${wiki}.wikia.com/api.php`,
        headers: {
            'User-Agent': 'Neutral edit summary maker'
        },
        qs: {
            action: 'edit',
            text: `#REDIRECT [[${page.replace('Ripto22475', 'Icier')}]]`,
            title: page,
            bot: '1',
            minor: '1',
            summary: 'Fixing double redirect ([[w:c:kocka:KockaBot#Icier rename|info]])',
            nocreate: '1',
            token: tokens[wiki],
            format: 'json'
        },
        jar,
        json: true
    }).then(function(d) {
        if (!d || d.error) {
            console.log(`Error occurred while editing ${page} on ${wiki}!`, d.error);
            errors[`${wiki}:${page}`] = d.error;
        }
    }).catch(function(e) {
        console.log(`Error occurred while editing ${page} on ${wiki}!`);
        errors[`${wiki}:${page}`] = e;
    });
}

function editPage() {
    const wiki = wikis[0];
    if (!wiki) {
        fs.writeFileSync('errors.json', JSON.stringify(errors, null, '    '));
        clearInterval(interval);
        return;
    }
    const page = data[wiki].shift();
    if (data[wiki].length === 0) {
        wikis.shift();
    }
    if (!tokens[wiki]) {
        getToken(wiki, page);
    } else {
        doEdit(wiki, page);
    }
}

http({
    method: 'POST',
    uri: 'https://services.wikia.com/auth/token',
    headers: {
        'User-Agent': 'Neutral edit summary maker'
    },
    form: config,
    jar
}).then(function(d) {
    console.log('Logged in, editing...');
    interval = setInterval(editPage, 1000);
}).catch(function(e) {
    console.log('Login error occurred', e);
});

