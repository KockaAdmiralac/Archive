'use strict';
const data = require('./wikis-filtered.json'),
      fs = require('fs');
let text = '';

for(let i in data) {
    const d = data[i];
    text += `${d.domain} | ${d.name}\n`;
}

fs.writeFileSync('wikis-formatted.txt', text);
