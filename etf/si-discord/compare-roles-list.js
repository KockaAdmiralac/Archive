'use strict';

const {readData} = require('./util.js');
const {argv} = require('process');
const Database = require('./db.js');

async function readList(filename) {
    return (await readData(filename))
        .map(([email]) => email.slice(2, 8));
}

async function main() {
    const list1 = await readList(argv[2]);
    const list2 = await readList(argv[3]);
    console.info('Missing from list1:', list2.filter(el => !list1.includes(el)));
    console.info('Missing from list2:', list1.filter(el => !list2.includes(el)));
    const list1Missing = list2.filter(el => !list1.includes(el));
    const realList1Missing = [];
    const db = new Database();
    for (const indexYear of list1Missing) {
        const index = Number(indexYear.slice(2));
        const year = Number(`20${indexYear.slice(0, 2)}`);
        if (await db.getStudent(year, index)) {
            realList1Missing.push(indexYear);
        }
    }
    console.info('Really missing from list1: ', realList1Missing);
    db.close();
}

main();
