const Discord = require('discord.js');
const client = new Discord.Client();
const webhookClient = new Discord.WebhookClient('Webhook ID', 'Webhook token');

client.on('ready', async () => {
    const channels = [
        "1200430690810986556"
    ]
        .map(id => client.channels.cache.get(id) || console.log(id))
        .filter(Boolean);

    var i = channels.length;
    while (i--) {
        await destroyChannel(channels[i]);
    }
    console.log('Finished?');
    client.destroy();
    webhookClient.destroy();
});

async function destroyChannel(channel) {
    const limit = 100;
    let after = '1216600757986525224';
    const all = [];
    while (true) {
        try {
            console.log('wat');
            const messages = await channel.messages.fetch({
                limit,
                after
            });
            try {
                for (const message of messages) {
                    if (message.webhookID && message.content.includes('triggered Global AF')) {
                        console.log(message.id);
                        await webhookClient.deleteMessage(message.id);
                    }
                }
                after = messages.first().id;
            } catch(e) {}
        } catch(e) {console.log(e);}
    }
}

client.login('Bot token');
