import {Client, Intents} from 'discord.js';
import {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    generateDependencyReport,
    NoSubscriberBehavior,
    AudioPlayerStatus
} from '@discordjs/voice';
import config from './config.json';

const {token, channelId, guildId, file} = config;
let count = 1;
let killing = false;

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

const onConnectionStateChange = (oldState, newState) => {
    console.info(`Connection state changed from ${oldState.status} to ${newState.status}`);
};

const onPlayerStateChange = (oldState, newState) => {
    console.info(`Player state changed from ${oldState.status} to ${newState.status}`);
};

const onError = (err) => {
    console.error('Unknown error', err);
};

const onClientReady = async () => {
    console.info('Ready.');
    const guild = await client.guilds.fetch(guildId);
    const connection = joinVoiceChannel({
        channelId,
        guildId,
        adapterCreator: guild.voiceAdapterCreator
    });
    connection.on('stateChange', onConnectionStateChange);
    connection.on('error', onError);
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        }
    });
    player.on('stateChange', onPlayerStateChange);
    player.on('error', onError);
    player.on(AudioPlayerStatus.Idle, () => {
        if (killing) {
            return;
        }
        console.info('Replaying, time', ++count);
        player.play(createAudioResource(file));
    });
    player.play(createAudioResource(file));
    const subscription = connection.subscribe(player);
    process.on('SIGINT', () => {
        killing = true;
        player.stop(true);
        subscription.unsubscribe();
        connection.disconnect();
        try {
            connection.destroy();
        } catch {
            // Already destroyed
        }
        client.destroy();
    });
};

client.on('ready', onClientReady);

console.debug(generateDependencyReport());
await client.login(token);
console.info('Logged in.');
