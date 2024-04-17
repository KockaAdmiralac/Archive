'use strict';
const fs = require('fs'),
      {Client} = require('discord.js'),
      {token, server} = require('./config.json');

const bot = new Client();

async function main() {
    const guild = await bot.guilds.resolve(server);
    const dump = {
        channels: guild.channels.cache,
        members: await guild.members.fetch(),
        messages: {}
    };
    for (const [id, channel] of guild.channels.cache) {
        if (!channel.messages) {
            continue;
        }
        let lastKey = undefined;
        while (true) {
            console.log('Fetching from', id, lastKey);
            const messages = await channel.messages.fetch({
                before: lastKey,
                limit: 100
            }), msgArray = messages.array();
            if (!msgArray.length) {
                break;
            }
            lastKey = messages.lastKey();
            if (!dump.messages[id]) {
                dump.messages[id] = [];
            }
            dump.messages[id].push(...msgArray);
        }
    }
    await fs.promises.writeFile('dump.json', JSON.stringify(dump));
    bot.destroy();
}

bot.on('ready', main);
bot.login(token);
