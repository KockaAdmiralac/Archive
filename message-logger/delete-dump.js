const Discord = require('discord.js');
const webhookClient = new Discord.WebhookClient({id: 'Webhook ID', token: 'Webhook token'});
const dump = require('./delete-dump.json');

async function main() {
    const messagesToDelete = dump.messages.filter(m => m.content.includes('triggered *Global AF - '));
    console.log(messagesToDelete);
    for (const message of messagesToDelete) {
        try {
            console.log(message.id);
            await webhookClient.deleteMessage(message.id);
        } catch (e) {console.error(e);}
    }
    webhookClient.destroy();
}

main();
