const vCard = require('vcf'),
      fs = require('fs'),
      Database = require('./db.js'),
      {cyrillify} = require('./util.js'),
      db = new Database();

async function main() {
    const cards = vCard.parse(await fs.promises.readFile('db.vcf', {
        encoding: 'utf-8'
    }));
    for (const card of cards) {
        const [lastName, firstName] = card.get('n').toJSON()[3];
        const phone = card.get('tel').toJSON()[3].replace(/ /g, '');
        const student = await db.getStudentByName(cyrillify(firstName), cyrillify(lastName));
        if (student) {
            await db.addPhoneNumber(student.year, student.index, Number(phone));
        } else {
            console.error('Nije pronađen student: ', firstName, lastName);
        }
    }
}

main();
