var mainNs = 0, pages = {}, api = new mw.Api(), results = [];
function apiCall(ns, apcontinue) {
    api.get({
        action: 'query',
        list: 'allpages',
        apnamespace: ns,
        apcontinue,
        apfilterredir: 'nonredirects',
        aplimit: 'max'
    }).done(function(d) {
        d.query.allpages.forEach(el => pages[el.ns].push(el.title));
        if(d.continue) {
            apiCall(ns, d.continue.apcontinue);
        } else {
            if(ns === mainNs) {
                apiCall(mainNs+1);
            } else {
                console.log(pages);
                pages[mainNs+1].forEach(function(el) {
                    if(!pages[mainNs].includes(el
                        .replace(' talk:', ':')
                        .replace('Talk:', '')
                    )) {
                        results.push(el);
                    }
                });
                document.write(results.join('<br />')); // jshint ignore: line
            }
        }
    });
}
pages[mainNs] = [];
pages[mainNs+1] = [];
apiCall(mainNs);
