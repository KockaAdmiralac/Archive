'use strict';

function makeRegex(wut, wat) {
    return new RegExp(require(`./${wut}-${wat}.json`).join('|'));
}

const data = require('./wikis-new.json'),
      checked = require('./wikis-checked.json'),
      fs = require('fs'),
      namebl = makeRegex('blacklist', 'name'),
      namewl = makeRegex('whitelist', 'name');
let filtered = {},
    bl = {};

for(let i in data) {
    const d = data[i],
          s = d.stats;
    if(
        d.wordmark ||
        s.admins > 1 ||
        d.topUsers.length > 3 ||
        d.headline ||
        s.edits > 300 ||
        s.images > 100 ||
        s.videos > 50 ||
        s.activeUsers > 3 ||
        d.flags ||
        Number(d.wam_score) > 3 ||
        d.image ||
        checked.indexOf(d.domain) !== -1 ||
        namewl.exec(d.name) ||
        namewl.exec(d.name)
    ) {
        continue;
    }
    if(namebl.exec(d.name) || namebl.exec(d.name)) {
        bl[i] = d;
    } else {
        filtered[i] = d;
    }
}

fs.writeFileSync('wikis-filtered.json', JSON.stringify(filtered));
fs.writeFileSync('wikis-blacklist.json', JSON.stringify(bl));
