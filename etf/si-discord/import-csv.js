const fs = require('fs');
const Database = require('./db.js');
const {readData} = require('./util.js');
const db = new Database();

async function main() {
    const data = await readData('import.csv');
    for (const [year, index, firstName, lastName, phoneNumber, discordId] of data) {
        const student = await db.getStudent(year, index);
        if (!student) {
            console.log(`INSERT INTO \`students\` (\`year\`, \`index\`, \`last_name\`, \`first_name\`, \`discord_id\`) VALUES ('${year}', '${index}', '${lastName}', '${firstName}', '${discordId}');`);
        }
        if (phoneNumber) {
            console.log(`INSERT INTO \`phone_numbers\` (\`number\`, \`index\`, \`year\`) VALUES ('${phoneNumber}', '${index}', '${year}');`)
        }
    }
    await db.close();
}

main();
