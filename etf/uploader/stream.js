import { URL } from 'url';
import got from 'got';

export default class StreamAPI {
    constructor(sessionInfo) {
        this.session = sessionInfo;
        this.lang = JSON.parse(sessionInfo.PrincipalInfo)
            .settings
            .general
            .defaultVideoLangauge;
        this.client = got.extend({
            prefixUrl: sessionInfo.ApiGatewayUri,
            headers: {
                Authorization: `Bearer ${sessionInfo.AccessToken}`
            },
            searchParams: {
                'api-version': sessionInfo.ApiGatewayVersion
            },
            resolveBodyOnly: true,
            retry: 0
        });
    }
    createVideo(name) {
        return this.client.post('videos', {
            json: {
                language: this.lang,
                name,
                privacyMode: 'private'
            }
        }).json();
    }
    startUpload(videoId, name) {
        return this.client.post(`videos/${videoId}/startUpload`, {
            json: {
                files: [{
                    name: `${name}.mp4`,
                    type: 'video'
                }]
            }
        }).json();
    }
    completeUpload(videoId, name) {
        return this.client.post(`videos/${videoId}/completeUpload`, {
            json: {
                files: [`${name}.mp4`]
            }
        }).json();
    }
    async getRoles() {
        const {value} = await this.client.get('roles').json();
        const ret = {};
        for (const {id, name} of value) {
            ret[name.toLowerCase()] = id;
        }
        return ret;
    }
    async setLinks(videoId, groupId, channelId, allowWrite) {
        const roles = await this.getRoles();
        const groupPrincipal = {
            principalId: groupId,
            principalType: 'StreamGroup'
        };
        return this.client.post(`videos/${videoId}/setLinks`, {
            json: {
                roleAssignments: [
                    {
                        roleId: roles.owner,
                        principals: allowWrite ? [groupPrincipal] : []
                    },
                    {
                        roleId: roles.viewer,
                        principals: allowWrite ? [] : [groupPrincipal]
                    }
                ],
                groupLinks: [{
                    groupId,
                    channels: [{
                        id: channelId
                    }]
                }]
            }
        }).json();
    }
    getBlockName(blockNumber) {
        return Buffer.from(`block-${String(blockNumber).padStart(8, 0)}`).toString('base64');
    }
    uploadBlock(url, buffer, blockNumber) {
        const parsedUrl = new URL(url);
        parsedUrl.searchParams.append('comp', 'block');
        parsedUrl.searchParams.append('blockid', this.getBlockName(blockNumber));
        return got.put(parsedUrl, {
            body: buffer,
            headers: {
                'x-ms-blob-type': 'BlockBlob'
            }
        });
    }
    uploadBlocklist(url, blockNumber) {
        const parsedUrl = new URL(url);
        parsedUrl.searchParams.append('comp', 'blocklist');
        return got.put(parsedUrl, {
            body: `<?xml version="1.0" encoding="utf-8"?><BlockList>${
                Array(blockNumber)
                    .fill()
                    .map((_, index) => `<Latest>${this.getBlockName(index)}</Latest>`)
                    .join('')
            }</BlockList>`,
            headers: {
                'x-ms-blob-content-type': 'video/mp4'
            }
        });
    }
    getStatus(videoId) {
        return this.client.get(`videos/${videoId}/status`).json();
    }
    updateVideo(videoId, body) {
        return this.client.patch(`videos/${videoId}`, {
            json: body
        });
    }
    async getMyVideos() {
        const videos = {};
        for (let i = 0; ; ++i) {
            const {value} = await this.client.get('videos?$filter=creator%2Fid%20eq%20%273f3df6aa-d84e-4cb9-8815-8ad03a372c69%27', {
                searchParams: {
                    '$top': 100,
                    '$skip': i * 100,
                    '$filter': 'creator/id eq \'3f3df6aa-d84e-4cb9-8815-8ad03a372c69\''
                }
            }).json();
            if (value.length === 0) {
                break;
            }
            for (const video of value) {
                videos[video.id] = video;
            }
        }
        return videos;
    }
}
