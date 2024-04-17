var api = new mw.Api(), array = [], namespace = 0;
console.clear();

function apiCall(apcontinue) {
    if(typeof apfrom !== 'undefined') {
        console.log(apfrom[0]);
    }
    api.get({
        action: "query",
        list: "allpages",
        aplimit: 500,
        apnamespace: namespace,
        apfilterredir: "nonredirects",
        apcontinue
    }).done(function(d) {
        array = array.concat(d.query.allpages.map(function(el){ return el.title; }));
        if(d.continue) {
            apiCall(d.continue.apcontinue);
        } else {
            console.log(array.filter(function(page) {
                var segments = page.split('/');
                if (segments.length === 1) {
                    return false;
                }
                segments.pop();
                return !array.includes(segments.join('/'));
            }).join('\n'));
        }
    }).fail(function(a){ apiCall(apfrom); });
}
apiCall();
