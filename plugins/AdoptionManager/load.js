define('adoption.config', ['mw'], function(mw) {
    'use strict';
    return mw.config.get([
        'wgCityId',
        'wgNamespaceNumber',
        'wgPageName'
    ]);
});

require(['adoption.config', 'wikia.window'], function(config, window) {
    'use strict';
    if (
        window.AdoptionManagerLoaded ||
        config.wgCityId !== '177' ||
        config.wgNamespaceNumber !== 118 ||
        config.wgPageName === 'Adoption:Requests'
    ) {
        return;
    }
    window.AdoptionManagerLoaded = true;
    window.importArticles({
        type: 'script',
        articles: [
            'u:dev:MediaWiki:UI-js/code.js',
            'u:kocka:MediaWiki:AdoptionManager/io.js',
            'u:kocka:MediaWiki:AdoptionManager/ui.js',
            'u:kocka:MediaWiki:AdoptionManager/core.js'
        ]
    });
    window.importArticle({
        type: 'style',
        article: 'u:kocka:MediaWiki:AdoptionManager/code.css'
    });
});