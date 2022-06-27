'use strict';
let promise = new Promise(r => r()),
    counter = 0,
    j = 0,
	errids = [];

const fs = require('fs'),
      http = require('request-promise-native'),
      FIRST = 0,
      LAST = 1566000,
      result = {},
      interval = setInterval(
          function() {
              console.log(`${j}/${LAST} [${counter}]`);
              fs.writeFile(
                  'wikis.json',
                  JSON.stringify(result),
                  () => {}
              );
			  fs.writeFile(
			      'errors.txt',
				  errids.join('\n'),
				  () => {}
			  );
          },
          5000
      );

for(let i = FIRST; i <= LAST; i += 25) {
    promise = promise.then(() => http({
        method: 'POST',
        uri: 'http://www.wikia.com/api/v1/Wikis/Details',
        qs: {
            ids: [...Array(25).keys()].map(a => a + i + 1).join(',')
        },
        json: true
    })).then(function(d) {
        const it = d.items;
        for(let p in it) {
            ++counter;
            result[p] = it[p];
        }
        j = i;
    }, function(e) {
		console.log(e.message);
		errids = errids.concat(e.options.qs.ids.split(','));
	});
}
console.log('Finished setting up promises');
promise.then(function() {
    fs.writeFileSync('wikis.json', JSON.stringify(result));
    process.exit();
});