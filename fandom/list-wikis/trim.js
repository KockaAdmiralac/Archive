'use strict';
let data = require('./wikis.json');
const fs = require('fs');

for(let i in data) {
    let d = data[i];
    // Copy of d.domain
    delete d.url;
    // Copy of key
    delete d.id;
    // It's the same on all wikis
    delete d.stats.users;
    // Copy of d.name
    delete d.title;
    // We don't need properties that don't exist
    if(!d.headline) {
        delete d.headline;
    }
    if(!d.desc) {
        delete d.desc;
    }
    if(!d.image) {
        delete d.image;
    }
    if(!d.wordmark) {
        delete d.wordmark;
    }
    // It's obvious enough all domains will end in .wikia.com
    d.domain = d.domain.replace('.wikia.com', '');
    if(d.flags.length === 0) {
        delete d.flags;
    }
    data[i] = d;
}

fs.writeFileSync('wikis-new.json', JSON.stringify(data));
