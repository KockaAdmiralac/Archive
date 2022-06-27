'use strict';
const wikis = require('./wikis.json'),
      results = [];
for (const i in wikis) {
    const res = /^https?:\/\/(.*)\.wikia\.com$/.exec(wikis[i].url);
    if (res) {
        results.push(res[1]);
    } else {
        console.log(wikis[i].url, i);
    }
}
require('fs').writeFileSync('list.json', JSON.stringify(results, null, '    '));
