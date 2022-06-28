'use strict';
const fs = require('fs'),
      util = require('util'),
      stream = require('stream'),
      PDFMerger = require('pdf-merger-js'),
      got = require('got');

const http = got.extend({
    headers: {
        'User-Agent': 'dmilicev PDF downloader'
    },
    method: 'GET',
    prefixUrl: process.argv[2],
    resolveBodyOnly: true,
    retry: 0
}), pipeline = util.promisify(stream.pipeline), merger = new PDFMerger();

async function main() {
    let i = 1;
    const {slideList} = JSON.parse(await http('assets/header.json'));
    for (const slideName of slideList) {
        const filename = `pdfs/${String(i).padStart(4, '0')}.pdf`;
        await pipeline(
            http.stream(`assets/${slideName}/assets/${slideName}.pdf`),
            fs.createWriteStream(filename)
        );
        const numPages = (await fs.promises.readFile(filename)).toString().match(/\/Type[\s]*\/Page[^s]/g).length;
        const pageToGrab = (numPages === 3 && process.argv[3] === '5.pdf') ?
            1 :
            numPages - 1;
        merger.add(filename, [pageToGrab]);
        ++i;
    }
    await merger.save(process.argv[3]);
}

main();
