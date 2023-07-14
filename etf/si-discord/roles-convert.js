const {value} = require('./roles-convert.json');
const {writeFile} = require('fs/promises');

async function main() {
    await writeFile(
        'roles.txt',
        value
            .map(m => m.principal.mail)
            .filter(m => m.endsWith('@student.etf.bg.ac.rs'))
            .join('\n'),
        {
            encoding: 'utf-8'
        }
    );
}

main();
