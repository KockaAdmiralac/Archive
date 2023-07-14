'use strict';

const subjectMap = require('./subjects.json');
const {writeFile} = require('fs/promises');
const {argv, exit} = require('process');

async function main() {
    if (!argv[2]) {
        console.error('Script requires one argument.');
        exit(1);
    }
    const subject = argv[2];
    await writeFile(
        'roles.txt',
        Object.entries(subjectMap)
            .filter(([_, subjects]) => subjects.includes(subject))
            .map(([key]) => `aa${key.slice(2, 4)}${key.slice(4).padStart(4, '0')}d@student.etf.bg.ac.rs`)
            .join('\n'),
        {
            encoding: 'utf-8'
        }
    );
}

main();
