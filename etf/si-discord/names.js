const Database = require('./db.js');
const {readData} = require('./util.js');
const db = new Database();

async function main() {
    const data = await readData('names.txt');
    for (const [yearStr, indexStr] of data) {
        const year = Number(yearStr);
        const index = Number(indexStr);
        const student = await db.getStudent(year, index);
        if (student) {
            console.info(student.first_name, student.last_name);
        } else {
            console.info('???');
        }
    }
    db.close();
}

main();
