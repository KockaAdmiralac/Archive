'use strict';
const fs = require('fs'),
      s = fs.readFileSync('wikis-checked.txt').toString(),
      regex = /\{\{badwiki\|([^\}\|]+)/,
      arr = [];

s.match(/\{\{badwiki\|[^\}]+\}\}/g).forEach(function(el) {
    const stuff = regex.exec(el) || regex.exec(el);
    if(stuff) {
        arr.push(stuff[1]);
    } else {
        console.log(el);
    }
});

fs.writeFileSync('wikis-checked.json', JSON.stringify(arr));
