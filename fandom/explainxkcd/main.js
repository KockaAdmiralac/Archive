const Client = require('nodemw');
const {promisify} = require('util');
const wait = promisify(setTimeout);
const config = require('./config.json');
const bot = new Client({
    protocol: 'https',
    server: 'www.explainxkcd.com',
    path: '/wiki',
    debug: false,
    username: config.username,
    password: config.password,
    userAgent: 'Countervandalism script',
    concurrency: 9999
});

const BATCH_SIZE = 50;

function getTop() {
    return new Promise((resolve, reject) => {
        bot.api.call({
            action: 'query',
            list: 'usercontribs',
            ucuser: config.target,
            uctoponly: 1,
            uclimit: 'max'
        }, (err, info, next, data) => {
            if (err || data.error) {
                reject(err || data.error);
            } else {
                resolve(data);
            }
        })
    });
}

function getRevisions(title) {
    return new Promise((resolve, reject) => {
        bot.api.call({
            action: 'query',
            indexpageids: 1,
            prop: 'revisions',
            rvlimit: 'max',
            rvprop: 'user|ids',
            titles: title
        }, (err, info, next, data) => {
            if (err || data.error) {
                reject(err || data.error);
            } else {
                resolve(data.query.pages[data.query.pageids[0]].revisions);
            }
        })
    });
}

function getRevisionContent(revid) {
    return new Promise((resolve, reject) => {
        bot.api.call({
            action: 'query',
            indexpageids: 1,
            prop: 'revisions',
            revids: revid,
            rvprop: 'content'
        }, (err, info, next, data) => {
            if (err || data.error) {
                reject(err || data.error);
            } else {
                const page = data.query.pages[data.query.pageids[0]];
                resolve(page.revisions ? page.revisions[0]['*'] : '');
            }
        })
    });
}

function edit(title, content) {
    return new Promise((resolve, reject) => {
        bot.edit(title, content, 'rv', true, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    });
}

async function revert({title}) {
    const revisions = await getRevisions(title);
    if (config.target !== revisions[0].user) {
        console.info('Edit conflict.');
        return;
    }
    let lastUser = null;
    let revId = null;
    for (const {user, revid} of revisions) {
        if (user !== config.target) {
            // Remember last author
            lastUser = user;
            // Get revision to revert to
            revId = revid;
            break;
        }
    }
    if (!lastUser) {
        console.log('That is his page.');
        return;
    }
    const content = await getRevisionContent(revId);
    await edit(title, content);
}

bot.logIn(async () => {
    while (true) {
        await wait(1000);
        try {
            let {query: {usercontribs: contribs}} = await getTop();
            console.info(contribs.length, 'revisions');
            while (contribs.length > 0) {
                const batch = contribs.slice(0, BATCH_SIZE);
                await Promise.all(batch.map(revert));
                contribs = contribs.slice(BATCH_SIZE);
            }
        } catch (error) {
            console.error('Failure:', error);
        }
    }
});

setTimeout(() => {
    console.info('Refreshing script.');
    process.exit(1);
}, 60000);
