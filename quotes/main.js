#!/usr/bin/env node
'use strict';
import {readFile, readdir, writeFile} from 'fs/promises';

async function readJSON(file) {
    try {
        return JSON.parse(await readFile(file, {
            encoding: 'utf-8'
        }));
    } catch (error) {
        return {
            excludedFiles: []
        };
    }
}

function writeJSON(file, json) {
    return writeFile(file, JSON.stringify(json, null, '    '), {
        encoding: 'utf-8'
    });
}

function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function main() {
    const {year, excludedFiles} = await readJSON('config.json');
    const currentYear = new Date().getFullYear();
    const currentExcludedFiles = currentYear === year ? excludedFiles : [];
    const currentFiles = await readdir('txt');
    const filesBeingChosen = currentFiles.filter(f => !currentExcludedFiles.includes(f));
    if (filesBeingChosen.length === 0) {
        console.error('No files to choose between!');
        return;
    }
    const chosenFile = choice(filesBeingChosen);
    console.info((await readFile(`txt/${chosenFile}`, {
        encoding: 'utf-8'
    })).trim());
    await writeJSON('config.json', {
        year: currentYear,
        excludedFiles: [...currentExcludedFiles, chosenFile]
    });
}

main();
