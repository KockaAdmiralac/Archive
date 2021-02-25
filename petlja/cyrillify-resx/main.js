const util = require('util'),
      r2j = util.promisify(require('resx/resx2js')),
      j2r = util.promisify(require('resx/js2resx')),
      fsPromises = require('fs').promises,
      cyrillic = require('./cyrillic.json');

async function run() {
    const xml = await fsPromises.readFile('in.resx');
    const resx = await r2j(xml.toString());
    const cyrillified = {};
    for (const key in resx) {
        let str = resx[key];
        for (const letter in cyrillic) {
            str = str.replace(new RegExp(letter, 'g'), cyrillic[letter]);
        }
        cyrillified[key] = str;
    }
    const outxml = await j2r(cyrillified);
    await fsPromises.writeFile('out.resx', outxml);
}

run();
