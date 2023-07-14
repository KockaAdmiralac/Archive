const fs = require('fs'),
      Database = require('./db.js'),
      {readData} = require('./util.js'),
      db = new Database();

async function main() {
    const data = await readData('pn.txt');
    for (const [phone, firstName, lastName] of data) {
        await db.addPhoneNumberName(firstName, lastName, Number(phone));
    }
}

main();
