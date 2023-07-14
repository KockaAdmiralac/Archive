const { Client, Intents } = require('discord.js'),
      mysql = require('mysql2/promise'),
      fs = require('fs'),
      config = require('./config.json');

const bot = new Client({
    intents: Intents.FLAGS.DIRECT_MESSAGES |
             Intents.FLAGS.DIRECT_MESSAGE_REACTIONS |
             Intents.FLAGS.DIRECT_MESSAGE_TYPING |
             Intents.FLAGS.GUILDS |
             Intents.FLAGS.GUILD_BANS |
             Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS |
             Intents.FLAGS.GUILD_INTEGRATIONS |
             Intents.FLAGS.GUILD_INVITES |
             Intents.FLAGS.GUILD_MEMBERS |
             Intents.FLAGS.GUILD_MESSAGES |
             Intents.FLAGS.GUILD_MESSAGE_REACTIONS |
             Intents.FLAGS.GUILD_MESSAGE_TYPING |
             Intents.FLAGS.GUILD_PRESENCES |
             Intents.FLAGS.GUILD_VOICE_STATES |
             Intents.FLAGS.GUILD_WEBHOOKS
});

async function main() {
    const guild = await bot.guilds.resolve(config.server);
    const channel = await guild.channels.fetch(config.channel);
    const message = await channel.messages.fetch(config.message);
    const users = new Set();
    for (const reaction of message.reactions.cache.keys()) {
        const messageReaction = message.reactions.cache.get(reaction);
        const userCollection = await messageReaction.users.fetch();
        for (const userId of userCollection.keys()) {
            if (users.has(userId)) {
                console.info('Voted multiple times:', userId);
            }
            users.add(userId);
        }
    }
    console.info('Unique users:', users.size);
    await guild.members.fetch();
    const connection = await mysql.createConnection(config.db);
    const file = await fs.promises.readFile('voting-roles.txt', {
        encoding: 'utf-8'
    });
    const subjectUsers = new Set(file.trim().split('\n').map(row => `20${row.match(/\w{2}(\d{6})d@student.etf.bg.ac.rs/)[1]}`));
    for (const user of users) {
        const [rows, fields] = await connection.execute('SELECT `index`, `year` FROM `students` WHERE `discord_id` = ?', [user]);
        if (rows.length === 0) {
            console.info('Anonymous user:', user);
        } else if (rows.length === 1) {
            const {index, year} = rows[0];
            if (!subjectUsers.has(`${String(year).padStart(4, 0)}${String(index).padStart(4, 0)}`)) {
                console.info('Not on subject:', user, index, year);
            }
        } else {
            console.info('wtf', user);
        }
    }
    bot.destroy();
    connection.end();
}

bot.on('ready', main);
bot.login(config.token);
