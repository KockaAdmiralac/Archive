import got from 'got';
import {argv} from 'node:process';
import {readFile, writeFile} from 'node:fs/promises';
import {parse} from 'node-html-parser';

async function getQA(wiki, page) {
    const response = await got(`https://${wiki}.fandom.com/wiki/${encodeURIComponent(page)}`).text();
    const tree = parse(response);
    const questions = tree.querySelectorAll('.trfc161__question').map(e => e.textContent);
    const answers = tree.querySelectorAll('.trfc161__answer').map(e => e.textContent);
    return questions.map((q, i) => [q, answers[i]]);
}

const wiki = argv[2];
const pages = (await readFile(argv[3], {
    encoding: 'utf-8'
})).split('\n');
const qa = {};
for (const page of pages) {
    qa[page] = await getQA(wiki, page);
    console.debug(qa[page]);
}
await writeFile(
    `${wiki}.mediawiki`,
    Object.entries(qa)
        .filter(([_, data]) => data.length > 0)
        .map(([page, data]) => `== ${page} ==\n${
            data
                .map(([question, answer]) => `; ${question}\n: ${answer}`)
                .join('\n')
        }`)
        .join('\n\n'),
    {
        encoding: 'utf-8'
    }
);
// console.log(await getQA('undertale', 'Sans'));
