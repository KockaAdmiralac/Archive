// jshint node: true, esversion: 6
'use strict';
const fs = require('fs');
fs.writeFileSync('code.js', ['load', 'io', 'ui', 'main'].map(file => fs.readFileSync(`${file}.js`).toString()).join('\n'));