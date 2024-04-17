'use strict';
const http     = require('request-promise-native'),
      fs       = require('fs'),
      wikis    = require('./wikis.json'),
      newpages = {},
      wikiList = Object.keys(wikis);

function apiCall(wiki, from) {
    if (!wiki) {
        wiki = wikiList.shift();
        if (!wiki) {
            let str = '';
            for (const i in wikis) {
                const newArr = newpages[i] || [],
                      oldArr = wikis[i].pages || [],
                      newPages = newArr.filter(p => !oldArr.includes(p)),
                      oldPages = oldArr.filter(p => !newArr.includes(p));
                if (!newPages.length && !oldPages.length) {
                    continue;
                }
                str += `http://${wikis[i].url}\n${
                        newPages.map(p => `+${p}`).join('\n')
                    }\n${
                        oldPages.map(p => `-${p}`).join('\n')
                    }\n--------------------------------------\n`;
                wikis[i].pages = newpages[i];
            }
            console.log('Writing to diff file...');
            fs.writeFile('diff.txt', str, function(err) {
                if (err) {
                    console.log('Writing to diff file unsuccessful!', err);
                } else {
                    
                    console.log('Writing new wikis.json...');
                    fs.writeFile('wikis-new.json', JSON.stringify(wikis, null, '    '), function(err2) {
                        if (err) {
                            console.log('Writing to new wikis.json unsuccessful!', err);
                        } else {
                            console.log('Finished!');
                        }
                    });
                }
            });
            return;
        }
        console.log(`Reading all pages from ${wikis[wiki].url}...`);
        newpages[wiki] = [];
    }
    http({
        type: 'GET',
        uri: `http://${wikis[wiki].url}/api.php`,
        qs: {
            action: 'query',
            list: 'allpages',
            apnamespace: 0,
            apfilterredir: 'nonredirects',
            aplimit: 'max',
            apfrom: from,
            format: 'json',
            t: Date.now()
        },
        headers: {
            'User-Agent': 'Interwiki pages comparison v1.0'
        },
        json: true
    }).then(function(d) {
        if (!d.query) {
            console.log('No query:', d);
            apiCall();
            return;
        }
        newpages[wiki] = newpages[wiki].concat(d.query.allpages.map(p => p.title));
        if (d['query-continue']) {
            apiCall(wiki, d['query-continue'].allpages.apfrom);
        } else {
            apiCall();
        }
    }).catch(e => console.log('HTTP error:', e));
}

apiCall();
