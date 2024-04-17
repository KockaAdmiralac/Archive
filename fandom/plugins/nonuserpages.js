(function() {
    var api, pages = [], results = [];
    function apiCall(apfrom) {
        if (!api) {
            api = new mw.Api();
            console.log('Started stage 1!');
        }
        api.get({
            action: 'query',
            list: 'allpages',
            apfrom: apfrom,
            apnamespace: 2,
            aplimit: 'max'
        }).done(function(d) {
            if (d.error) {
                console.log('API error occurred:', d.error);
            } else {
                pages = pages.concat(d.query.allpages.map(function(p) {
                    return p.title;
                }));
                if (d['query-continue']) {
                    apiCall(d['query-continue'].allpages.apfrom);
                } else {
                    console.log('Started stage 2!');
                    apiCall2();
                }
            }
        }).error(function(e) {
            console.log('Error occurred, continuing:', e);
            apiCall(apfrom);
        });
    }
    function apiCall2() {
        var p = pages.shift();
        if (!p) {
            console.log('Finished!!!');
            console.log(results.join('\n'));
            return;
        }
        api.get({
            action: 'query',
            titles: p,
            prop: 'revisions',
            rvdir: 'newer',
            rvlimit: 1
        }).done(function(d) {
            if (d.error) {
                console.log('API error occurred:', d.error, 'continuing');
            } else {
                var pages = d.query.pages,
                    page  = pages[Object.keys(pages)[0]];
                if (!page) {
                    console.log('wat, there\'s no page: ', pages);
                } else if (!page.revisions) {
                    console.log('wat, page has no revisions: ', page);
                } else if (!page.revisions[0]) {
                    console.log('wat, page has no first revision: ', page);
                } else {
                    var user = page.revisions[0].user;
                    if (user !== page.title.substring(5) && user !== 'Wikia' && user !== 'FANDOM' && page.title.indexOf('/') === -1) {
                        results.push(page.title);
                        console.log('Found: ', page);
                    }
                }
                apiCall2();
            }
        }).error(function(e) {
            console.log('Error occurred on ' + p + ', continuing');
            apiCall2();
        });
    }
    mw.loader.using('mediawiki.api').then(apiCall);
})();
