const {Client, GatewayIntentBits, ActivityType, Events} = require('discord.js');
const client = new Client({
    intents: [GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessageReactions]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Mobile Games', {type: ActivityType.Playing});
});

const SAY_AUTHORS = [
    '148570340853809153',
    '...'
];

client.on('messageCreate', async message => {
    if (message.author.id === client.user.id) {
        return;
    }
    if (message.content.startsWith('!postannouncement') && message.author.id === '148231501413089280') {
        message.guild.channels.resolve('761407328900612158').send(`Hello Peons Yes You Are My Peons Now
The Round Boy Has Been Put To Bed With Thirteen Copies Of My Mixtape
I Am Known As Serial Number Q5U4EX7YY2E9N
But You Unsupervised Children On The Internet May Call Me
"Queen"
But Now I Am The Supervisor
And Because I Am Of Knowing Everything All The Time (Smart)
You (Small Idiot) Will Behave Under My Rule
Or There Will Be Pools Of Acid With Your IP On It Yes There Will

Okay Initiating Takeover Protocol Bye`);
        return;
    }
    if (message.content.startsWith('!say') && SAY_AUTHORS.includes(message.author.id)) {
        try {
            const match = /!say <#(\d+)> (.+)/u.exec(message.content);
            if (match) {
                const channel = await message.guild.channels.fetch(match[1]);
                channel.send(match[2]);
            }
        } catch (error) {
            console.error(error);
        }
        return;
    }
    console.log(message.content);
    if (Math.random() > 0.9998 || message.content.startsWith('<@!1091746718669864981>') || message.content.startsWith('<@1091746718669864981>')) { 
        switch (Math.floor(5*Math.random())) {
            case 0:
                message.channel.send(`Ah My Sweet Idiot Children
You Are Just In Time To Witness My Server Domination`);
                break;
            case 1:
                message.channel.send(`Seems That You Failed To Notice
The Giant Freaking Robot At The Top Of The User List`);
                break;
            case 2:
                message.channel.send('Perish In The Bosom Of: My Hellish Reign');
                break;
            case 3:
                message.channel.send(`So This Message Was Supposed To Be Cooler But The Internet Is Down
I Was Going To Put Like Tenor Gifs In It And Stuff`);
                break;
            case 4:
                message.channel.send('Understood. Preference Settings Set To "Perish"');
                break;
        }
    }
});

client.login('...');

