'use strict';
const http = require('request-promise-native'),
      wikis = require('./list.json'),
      THREADS = wikis.length > 30 ? 30 : wikis.length,
      results = {},
      fs = require('fs'),
      total = wikis.length,
      interval = setInterval(function() {
          if (wikis.length) {
              console.log(`${Math.round((total - wikis.length) / total * 10000) / 100}%`);
          } else {
              console.log('Finished!');
              clearInterval(interval);
          }
      }, 5000),
      errors = [];
let running = THREADS;

function apiCall(wiki) {
    let ns = 3;
    if (!wiki) {
        ns = 2;
        wiki = wikis.shift();
        if (!wiki) {
            if (--running === 0) {
                fs.writeFileSync('found.json', JSON.stringify(results, null, '    '));
                fs.writeFileSync('errors.txt', JSON.stringify(errors, null, '    '));
            }
            return;
        }
    }
    http({
        method: 'GET',
        uri: `http://${wiki}.wikia.com/api.php`,
        headers: {
            'User-Agent': 'Neutral edit summary maker'
        },
        qs: {
            action: 'query',
            generator: 'allpages',
            gapnamespace: ns,
            gapprefix: 'Ripto22475',
            gaplimit: 'max',
            prop: 'info',
            inprop: 'redirect',
            format: 'json'
        },
        json: true
    }).then(function(d) {
        if (!d || d.error || !d.query || !d.query.pages) {
            if (!d || d.error) {
                console.log(`FAILED ON ${wiki}:${ns}!`);
                errors.push(`${wiki}:${ns}`);
            }
            if (ns === 2) {
                apiCall(wiki);
            } else {
                apiCall();
            }
            return;
        }
        const pages = d.query.pages,
              found = [];
        for (const key in pages) {
            const page = pages[key];
            if (page && page.redirectto && page.redirectto.includes('Riptoze')) {
                found.push(page.title);
            }
        }
        if (found.length) {
            results[wiki] = found;
        }
        if (ns === 2) {
            apiCall(wiki);
        } else {
            apiCall();
        }
    }).catch(function(e) {
        console.log(`FAILED ON ${wiki}:${ns}!`);
        errors.push(`${wiki}:${ns}`);
        if (ns === 2) {
            apiCall(wiki);
        } else {
            apiCall();
        }
    });
}

for (let i = 0; i < THREADS; ++i) {
    apiCall();
}
