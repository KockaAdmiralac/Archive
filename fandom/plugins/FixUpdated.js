/* eslint-disable */
const api = new mw.Api();

function getContent(title) {
    return api.get({
        action: 'query',
        titles: title,
        prop: 'revisions',
        rvprop: 'content',
        rvslots: 'main'
    }).then(function(data) {
        return Object.values(data.query.pages)[0].revisions[0].slots.main['*'];
    });
}

const pages = `CatFilter
CatFilter/es
CatFilter/tr
DateInserter
DateInserter/es
DateInserter/ru
DisableCode
DisableCode/uk
MorePageActions`.split('\n');

function wait(time) {
    return new Promise(res => setTimeout(res, time));
}

async function main() {
    for (const page of pages) {
        console.log('Editing', page);
        await api.edit(page, revision => {
            const content = revision.content;
            if (content.match(/\|\s*[uU]pdated\s*=/)) {
                // Page already has Updated parameter.
                console.log('Already has Updated');
                return content;
            }
            const regex = /(\|\s*Code\s*=(.*?))(\n\|)/s;
            const res = regex.exec(content);
            if (!res) {
                // No matching insertion point.
                console.log('No matching insertion point');
                return content;
            }
            const code = res[2].match(/\[\[Media[wW]iki:(.*)\/code.js/);
            if (!code) {
                // Pages named /code.js were not found.
                console.log('/code.js not found');
                return content;
            }
            const newContent = content.replace(regex, `$1\n| Updated = {{Updated|MediaWiki:${code[1]}/code.js}}$3`);
            return {
                text: newContent,
                summary: 'Fixing Updated parameter (test)',
                minor: true,
                bot: true
            };
        });
        console.log('Done');
        await wait(1000);
    }
}

main();
