const fs = require('fs');

const latinifyData = Object.entries(require('./latinify.json'))
    .map(([cyrl, latn]) => [new RegExp(cyrl, 'g'), latn]);
const cyrillifyData = Object.entries(require('./latinify.json'))
    .map(([cyrl, latn]) => [new RegExp(latn, 'g'), cyrl]);

function latinify(str) {
    let ret = str;
    for (const [cyrl, latn] of latinifyData) {
        ret = ret.replace(cyrl, latn);
    }
    return ret;
}

function cyrillify(str) {
    let ret = str;
    for (const [latn, cyrl] of cyrillifyData) {
        ret = ret.replace(latn, cyrl);
    }
    return ret;
}

async function readData(filename) {
    const file = await fs.promises.readFile(filename, {
        encoding: 'utf-8'
    });
    return file.trim().split('\n').map(line => line.trim().split(';'));
}

module.exports = {
    cyrillify,
    latinify,
    readData
};
