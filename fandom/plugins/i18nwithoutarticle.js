mediawiki.filter(function(page) {
    var res = /MediaWiki:Custom-(.*)\/i18n.json/.exec(page);
    if (!res) {
        return false;
    }
    return !allpages.includes(res[1]);
}).join('\n');
