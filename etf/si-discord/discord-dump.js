'use strict';
const fs = require('fs'),
      {Client} = require('discord.js'),
      {token, server} = require('./config.json');

const bot = new Client();

async function main() {
    const guild = await bot.guilds.resolve(server);
    const members = await guild.members.fetch();
    const strippedMembers = JSON.parse(JSON.stringify(members));
    for (const [id, member] of members) {
        strippedMembers.find(m => m.userID === id).roles = member._roles;
    }
    await fs.promises.writeFile('discord.json', JSON.stringify(strippedMembers));
    bot.destroy();
}

bot.on('ready', main);
bot.login(token);
