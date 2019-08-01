'use strict';
const found = require('./found.json'),
      res = {},
      fs = require('fs');
for (const wiki in found) {
    const js = found[wiki].filter(p => p.endsWith('.js') || p.endsWith('.css'));
    if (js.length) {
        res[wiki] = js;
    }
}
fs.writeFileSync('js.json', JSON.stringify(res, null, '    '));
