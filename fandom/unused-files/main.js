const http = require('request-promise-native'),
      fs = require('fs'),
      list = fs.readFileSync('list.txt').toString().split('\n'),
      THREADS = 10;
let running = THREADS,
    results = [];

function apiCall() {
    const file = list.shift();
    if (!file) {
        if (--running === 0) {
            fs.writeFileSync('out.txt', results.join('\n'));
        }
        return;
    }
    http({
        headers: {
            'User-Agent': 'Kocka\'s unused file finder',
            'Content-Type': 'application/json'
        },
        uri: 'https://thebleachfanon.wikia.com/api.php',
        qs: {
            action: 'query',
            list: 'imageusage',
            iutitle: file,
            iucount: '1',
            format: 'json'
        },
        transform: d => d.query.backlinks_count,
        json: true
    }).then(function(num) {
        if (num === 0) {
            console.log(file);
            results.push(file);
        }
        apiCall();
    });
}

for (let i = 0; i < THREADS; ++i) {
    apiCall();
}
