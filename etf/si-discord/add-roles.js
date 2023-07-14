'use strict';
const { Client, Intents } = require('discord.js'),
    mysql = require('mysql2/promise'),
    fs = require('fs'),
    { role, token, server, db } = require('./config.json');

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
    const guild = await bot.guilds.resolve(server);
    await guild.members.fetch();
    const connection = await mysql.createConnection(db);
    const file = await fs.promises.readFile('roles.txt', {
        encoding: 'utf-8'
    });
    const users = new Set(file.trim().split('\n').map(row => `20${row.match(/\w{2}(\d{6})d@student.etf.bg.ac.rs/)[1]}`));
    const [rows, fields] = await connection.execute('SELECT `index`, `year`, CAST(`discord_id` AS VARCHAR(255)) AS `discord_id` FROM `students` WHERE `discord_id` IS NOT NULL');
    for (const { index, year, discord_id } of rows) {
        if (users.has(`${String(year).padStart(4, 0)}${String(index).padStart(4, 0)}`)) {
            await connection.execute(
                'INSERT INTO `roles` (`role_id`, `index`, `year`) VALUES (?, ?, ?)',
                [role, index, year]
            );
            let member = null;
            if (discord_id) {
                try {
                    member = await guild.members.fetch(discord_id.toString());
                } catch (error) {
                    console.error('Ne postoji član', index, year, error);
                    continue;
                }
            }
            if (member) {
                await member.roles.add(role);
            } else {
                console.info('Student', index, year, 'not in server');
            }
        }
    }
    console.log('end');
    bot.destroy();
    connection.end();
}

bot.on('ready', main);
bot.login(token);
