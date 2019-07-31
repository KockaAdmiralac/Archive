var api = new mw.Api(), array = [], namespace = 0;
console.clear();
function apiCall(apfrom) {
    if(typeof apfrom !== 'undefined') {
        console.log(apfrom[0]);
    }
    api.get({
        action: "query",
        list: "allpages",
        aplimit: 500,
        apnamespace: namespace,
        apfilterredir: "nonredirects",
        apfrom: apfrom
    }).done(function(d) {
        array = array.concat(d.query.allpages.map(function(el){ return el.title; }));
        if(d["query-continue"]) {
            apiCall(d["query-continue"].allpages.apfrom);
        } else {
            array.forEach(function(el) { document.write(el + "<br/>"); });
        }
    }).fail(function(a){ apiCall(apfrom); });
}
apiCall();
