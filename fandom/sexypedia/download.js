const {XMLParser} = require('fast-xml-parser');
const md5 = require('js-md5');
const {Readable} = require('stream');
const {finished} = require('stream/promises');
const {createWriteStream} = require('fs');
const {access, unlink, readFile} = require('fs/promises');

async function exists(path) {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

async function main() {
    const parser = new XMLParser();
    const xml = await readFile('tumblrsexymen_pages_full.xml', 'utf-8');
    const tree = parser.parse(xml);
    const files = tree.mediawiki.page.filter(p => p.ns === 6).map(p => p.title);
    
    for (const file of files) {
        const unprefixed = file.replace(/^File:/, '').replace(/ /g, '_');
        const hash = md5(unprefixed);
        const url = `https://static.wikia.nocookie.net/sexypedia/images/${hash[0]}/${hash[0]}${hash[1]}/${encodeURIComponent(unprefixed)}/revision/latest?format=original`;
        if (await exists(`images/${unprefixed}`)) {
            continue;
        }
        console.log(file);
        const response = await fetch(url);
        const fileDestination = `images_diff/${unprefixed}`;
        const stream = createWriteStream(fileDestination, {flags: 'wx'});
        await finished(Readable.fromWeb(response.body).pipe(stream));
        const imageContent = await readFile(fileDestination);
        const imageHash = md5(imageContent);
        if (imageHash.toLowerCase() === '2cd486a128c45d24d003fe9ae62b1829') {
            console.log('Failed to fetch (404)', unprefixed);
            await unlink(fileDestination);
        }
        if (imageContent.includes('<html>')) {
            console.log('Failed to fetch', unprefixed);
            console.log(imageContent);
            await unlink(fileDestination);
        }
    }
}

main();
