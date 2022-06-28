'use strict';
const p = require('child_process'),
      cwd = process.cwd(),
      directory = `${cwd}/generated/altar`,
      fs = require('fs'),
      sprites = fs.readdirSync(`${directory}/sprite`),
      backgrounds = fs.readdirSync(`${directory}/bg`),
      scheduled = [];

sprites.forEach(function(file) {
    const {textures} = require(`${directory}/sprite/${file}`),
          name = file.slice(0, -5);
    textures.forEach(function(el, i) {
        const toWrite = (textures.length === 1) ?
            name :
            `${name}_${i}`;
        scheduled.push([`${directory}/extract/${el}.png`, `${cwd}/output/sprites/${toWrite}.png`]);
    });
});

backgrounds.forEach(function(background) {
    const {texture} = require(`${directory}/bg/${background}`),
          name = background.slice(0, -5);
    scheduled.push([`${directory}/extract/${texture}.png`, `${cwd}/output/backgrounds/${name}.png`]);
});

function execute() {
    const entry = scheduled.shift();
    if (!entry) {
        return;
    }
    p.execFile(
        '/bin/cp',
        [
            '--no-target-directory',
            entry[0],
            entry[1]
        ],
        {},
        function(error, stdout, stderr) {
            if (error || stdout !== '' || stderr !== '') {
                console.log('Possible error:', arguments);
            }
            execute();
        }
    );
}

execute();
