'use strict';
const http = require('request-promise-native'),
      fs = require('fs');

function archive(page) {
    http({
        method: 'GET',
        uri: `http://undertale.wikia.com/wiki/${page}`,
        qs: {
            action: 'raw'
        }
    }).then(function(d) {
        d = d.replace(/<\/pre>\n.*/, '')
             .replace(/<pre class="ChatLog">\n/, '')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>');
        const split = page.split('/'),
              date = new Date(split[split.length - 1]);
        fs.writeFileSync(`logs/${date.getMonth() + 1}/${date.getDate()}.txt`, d);
    }).catch(e => console.log(e));
}

http({
    method: 'GET',
    uri: 'http://undertale.wikia.com/api.php',
    qs: {
        action: 'query',
        list: 'categorymembers',
        cmtitle: 'Category:Chat logs',
        cmlimit: 500,
        format: 'json'
    },
    json: true
}).then(function(d) {
    const arr = d.query.categorymembers.map(e => e.title);
    arr.splice(-10);
    arr.forEach(archive);
}).catch(e => console.log(e));

