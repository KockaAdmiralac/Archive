'use strict';
const http = require('request-promise-native'),
      fs = require('fs'),
      data = require('./data.json');

http({
    method: 'GET',
    uri: 'http://community.wikia.com/api.php',
    qs: {
        action: 'query',
        list: 'logevents',
        leaction: 'upload/overwrite',
        leprop: 'title|user|timestamp',
        lelimit: 'max',
        leend: data.end,
        format: 'json'
    },
    json: true
}).then(function(d) {
    const arr = d.query.logevents, files = [];
    if(arr.length < 2) {
        return;
    }
    data.end = arr[0].timestamp;
    arr.filter(function(el) {
        const title = el.title;
        if(arr.indexOf(title) === -1) {
            arr.push(title);
            return true;
        } else {
            return false;
        }
    }, this).forEach(function(el) {
        if(data.wl.indexOf(el.user) === -1) {
            console.log(`http://c.wikia.com/wiki/${encodeURIComponent(el.title.replace(/ /g, '_')).replace(/%3A/g, ':')}`);
        }
    });
    fs.writeFileSync('data.json', JSON.stringify(data, null, '    '));
}).catch(e => console.log(e));
