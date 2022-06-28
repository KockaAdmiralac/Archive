import StreamAPI from './stream.js';
import {getSessionInfo, loadJSON} from './util.js';

async function main() {
    const groupId = '808b0172-7546-4c38-9673-78b391f0f018';
    //const channelId = '7091e52a-4932-4106-9d51-526c282e2f1f';
    const {chromiumData} = await loadJSON('config.json');
    const api = new StreamAPI(await getSessionInfo(chromiumData));
    const videos = await api.getMyVideos();
    const filteredVideos = Object.values(videos)
        .filter(v => v.name.match(/^(Tamara Šekularac|Stefan Tubić|Filip Hadžić|Konsultacije|Pokazna|Miroslav Bojo)/));
    console.log(filteredVideos.map(v => `${v.name} - https://web.microsoftstream.com/video/${v.id}`).join('\n'));
    /*
    for (const video of filteredVideos) {
        try {
            await api.setLinks(video.id, groupId, undefined, true);
        } catch (error) {
            console.error(error.response.body);
        }
    }
    */
}

main();
