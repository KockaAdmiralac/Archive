const discord = require('./discord.json'),
      {ignoredRoles} = require('./config.json'),
      fs = require('fs').promises,
      Database = require('./db.js'),
      db = new Database();

async function main() {
    const diff = [];
    for (const user of discord) {
        if (
            !ignoredRoles.some(r => user.roles.includes(r)) &&
            !await db.getStudentByDiscordID(user.userID)
        ) {
            diff.push([user.displayName, user.userID]);
        }
    }
    await fs.writeFile('discord-diff.txt', diff.map(a => a.join(';')).join('\n'), {
        encoding: 'utf-8'
    });
}

main();
