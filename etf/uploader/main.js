#!/usr/bin/env node
'use strict';
import { spawn } from 'child_process';
import { promises } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';
import process from 'process';
import { SingleBar, Presets } from 'cli-progress';
import StreamAPI from './stream.js';
import {wait, loadJSON, saveJSON, getSessionInfo} from './util.js';

const rl = createInterface({
    input: process.stdin,
    historySize: 0,
    output: process.stdout
});
const bar = new SingleBar({
    clearOnComplete: true,
    format: '|{bar}| {percentage}% ETA: {eta_formatted}',
    hideCursor: true
}, Presets.shades_classic);
const CHUNK_SIZE = 4 * 1024 * 1024,
      THREADS = 10;
// Shared resource!
let blockNumber = 0;

function question(text, def) {
    return new Promise(function(resolve) {
        const prompt = def ? `${text} (${def})` : text;
        rl.question(`${prompt}: `, answer => resolve(answer || def));
    });
}

async function selectFile(downloadsDir, newPath) {
    const files = (await promises.readdir(downloadsDir))
        .filter(f => f.endsWith('.mp4'));
    if (files.length > 1) {
        console.info(files.map((f, index) => `[${index}] ${f}`).join('\n'));
    }
    const selectedFile = files.length === 1 ?
        files[0] :
        files[Number(await question('Select a file'))];
    const oldPath = join(downloadsDir, selectedFile);
    await promises.rename(oldPath, newPath);
    return promises.open(newPath, 'r');
}

async function uploadTask(api, url, file) {
    const buffer = Buffer.alloc(CHUNK_SIZE);
    while (true) {
        const {bytesRead} = await file.read(buffer, 0, CHUNK_SIZE, null);
        if (bytesRead === 0) {
            break;
        }
        await api.uploadBlock(url, buffer, blockNumber++);
        bar.increment();
    }
}

async function uploadVideo(api, url, file) {
    blockNumber = 0;
    bar.start(Math.ceil((await file.stat()).size / CHUNK_SIZE), 0);
    await Promise.all(
        Array(THREADS)
            .fill()
            .map(() => uploadTask(api, url, file))
    );
    bar.stop();
    console.info('Uploading block list');
    await api.uploadBlocklist(url, blockNumber);
}

async function waitForProcessing(api, videoId) {
    let status = {};
    do {
        await wait(1000);
        status = await api.getStatus(videoId);
        process.stdout.write(status.processingStatus.map(
            ({type, state, progress}) => `${type} ${state} (${progress}%)`
        ).join(', '));
        process.stdout.write('\r');
    } while (status.state !== 'completed');
    console.info();
}

function getFullTeacher(config, teacher) {
    const teachers = Object.keys(config)
        .flatMap(key => config[key].p.teachers.concat(config[key].v.teachers))
        .filter(name => name.toLowerCase().includes(teacher.toLowerCase()));
    if (teachers.length === 1) {
        return teachers[0];
    } else {
        throw new Error('Specified teacher is not unique!');
    }
}

function getSubjectFromTeacher(config, teacher) {
    const subjects = [];
    for (const subject in config) {
        if (
            config[subject].p.teachers.includes(teacher) ||
            config[subject].v.teachers.includes(teacher)
        ) {
            subjects.push(subject);
        }
    }
    if (subjects.length === 1) {
        return subjects[0];
    }
}

function getTypeFromTeacherAndSubject(config, teacher, subject) {
    const subjData = config[subject];
    const isP = subjData.p.teachers.includes(teacher);
    const isV = subjData.v.teachers.includes(teacher);
    if (isP && !isV) {
        return 'p';
    } else if (isV && !isP) {
        return 'v';
    }
}

async function main() {
    const {chromiumData, downloadsDir, subjects, videoDir} = await loadJSON('config.json');
    const prev = await loadJSON('prev.json') || {};
    const teacher = getFullTeacher(subjects, await question('Teacher', prev.teacher));
    const subject = getSubjectFromTeacher(subjects, teacher) || await question('Subject', prev.subject);
    const type = getTypeFromTeacherAndSubject(subjects, teacher, subject) || await question('Type', prev.type);
    await saveJSON('prev.json', {teacher, subject, type});
    const groupId = subjects[subject].id;
    const channelId = subjects[subject][type].id;
    const directory = join(
        videoDir,
        subject,
        type === 'p' ? 'Predavanja' : 'Vežbe',
        subjects[subject][type].teachers.length === 1 ?
            '' :
            teacher
    );
    const numbers = (await promises.readdir(directory))
        .map(f => f.match(/\b(\d+)\. (?:p|v)/))
        .filter(Boolean)
        .map(m => Number(m[1]));
    const number = String(await question(
        'Number',
        numbers.length === 0 ?
            1 :
            Math.max(...numbers) + 1
    ))
        .split(',')
        .map(p => `${p.trim()}.`)
        .join(' i ');
    const title = `${teacher} - ${number} ${
        type === 'p' ?
            'predavanje' :
            'vežbe'
    } - ${new Date().toISOString().substring(0, 10)}`;
    console.info('Getting session info...');
    const api = new StreamAPI(await getSessionInfo(chromiumData));
    const file = await selectFile(downloadsDir, `${directory}/${title}.mp4`);
    spawn('./upload.sh', {
        stdio: [0, 'pipe', 'pipe']
    });
    if (!groupId) {
        console.info('Group ID not provided, not uploading to Stream.');
        await file.close();
        rl.close();
        return;
    }
    const description = await question('Description');
    console.info('Creating video...');
    const videoInfo = await api.createVideo(title);
    await api.updateVideo(videoInfo.id, {description});
    const uploadInfo = await api.startUpload(videoInfo.id, title);
    await api.setLinks(videoInfo.id, groupId, channelId);
    await uploadVideo(api, uploadInfo.files[0].uploadUrl, file);
    await api.completeUpload(videoInfo.id, title);
    await waitForProcessing(api, videoInfo.id);
    await api.updateVideo(videoInfo.id, {
        published: true
    });
    await file.close();
    rl.close();
}

process.on('SIGINT', function() {
    rl.close();
});

main();
