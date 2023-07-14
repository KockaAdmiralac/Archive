'use strict';

const got = require('got');
const { CookieJar } = require('tough-cookie');
const config = require('./config.json');
const {writeFile} = require('fs/promises');
const Database = require('./db.js');
const {promisify} = require('util');
const wait = promisify(setTimeout);

const http = got.extend({
    cookieJar: new CookieJar(),
    prefixUrl: 'https://student.etf.bg.ac.rs/',
    resolveBodyOnly: true
});

let viewState;

function getViewState(text) {
    return /<input type="hidden" name="javax.faces.ViewState" value="j_id(\d+)" \/>/.exec(text)[1];
}

async function visitSubjects() {
    const visit = await http.post('rasporedCasova/rasporedCasova.jsf', {
        form: {
            menu: 'menu',
            'javax.faces.ViewState': `j_id${viewState}`,
            'menu:_idcl': 'menu_nav1_item14'
        }
    });
    viewState = getViewState(visit);
}

async function getSubjects(year, index) {
    const subjects = await http.post('rasporedCasova/rasporedCasova.jsf', {
        form: {
            AJAXREQUEST: 'pretragaToggle',
            izborRasporeda: '1',
            godinaIndeks: year,
            brojIndeks: index,
            'javax.faces.ViewState': `j_id${viewState}`,
            'j_id740': 'j_id740',
        }
    });
    viewState = getViewState(subjects);
    const result = new Set();
    for (const match of subjects.matchAll(/<div class="akronimPredmeta"><span title="[^"]*">(.*?)<\/span>/g)) {
        result.add(match[1]);
    }
    return result;
}

function login() {
    return http('j_spring_security_check', {
        form: {
            j_username: config.username,
            j_password: config.password
        },
        method: 'POST'
    });
}

async function main() {
    viewState = getViewState(await login());
    const db = new Database();
    const students = await db.getAllStudents();
    const subjectMap = {};
    await visitSubjects();
    for (const {index, year} of students) {
        console.info('Retrieving', year, index);
        try {
            const subjects = await getSubjects(year, index);
            if (subjects.size === 0) {
                console.error('Retrieved no subjects, retrying once');
                const subjects2 = await getSubjects(year, index);
                console.log('Retrieved subjects:', subjects2);
                subjectMap[`${year}${index}`] = [...subjects2];
            } else {
                console.log('Retrieved subjects:', subjects);
                subjectMap[`${year}${index}`] = [...subjects];
            }
            await wait(10000);
        } catch (error) {
            console.error('An error occurred', error);
        }
    }
    await writeFile('subjects.json', JSON.stringify(subjectMap, null, '    '));
    db.close();
}

main();
