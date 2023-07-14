const {readData} = require('./util.js'),
      mysql = require('mysql2/promise'),
      {db} = require('./config.json');

async function main() {
    const data = await readData('discord.txt');
    const connection = await mysql.createConnection(db);
    await connection.execute(
        'INSERT INTO `students` (`year`, `index`, `last_name`, `first_name`, `discord_id`) VALUES ' +
        data.map(() => '(?, ?, ?, ?, ?)').join(', '),
        data
            .map(([year, index, surname, name, discord]) => [
                parseInt(year, 10),
                parseInt(index, 10),
                surname,
                name,
                discord === 'NULL' ? null : BigInt(discord)
            ])
            .flat()
    );
    connection.destroy();
}

main();
