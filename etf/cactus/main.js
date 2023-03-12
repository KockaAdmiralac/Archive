const xlsx = require('xlsx');
const fs = require('fs');

const file = xlsx.readFile('sheet.xlsx');
const cactus = {
    SQLTab: [{
        hidden: false,
        closable: false,
        renameable: false,
        name: 'User scheme',
        type: 'InitialScheme',
        script: fs.readFileSync('script.sql', {encoding: 'utf-8'})
    }],
    version: '1.1.1'
};

for (const sheetName of file.SheetNames) {
    const json = xlsx.utils.sheet_to_json(file.Sheets[sheetName]);
    const tab = {
        hidden: false,
        closable: false,
        renameable: false,
        name: sheetName,
        type: 'UserScript',
        script: ''
    };
    if (json.length) {
        const header = Object.keys(json[0]);
        const data = json.map(row => Object.values(row).map(v => String(v)));
        tab.testdata = {data, header};
    }
    cactus.SQLTab.push(tab);
}

fs.writeFileSync('out.cSQL', JSON.stringify(cactus/*, null, '    '*/));
