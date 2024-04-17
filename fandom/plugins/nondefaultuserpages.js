/* jshint esversion: 6 */
var api = new mw.Api(), results = [];

function callback2(d) {
    'use strict';
    $.each(d.query.pages, (k, v) => {
        if(![
            'Wikia',
            'Brandon Rhea',
            'Rappy 4187',
            'DaNASCAT',
            '127.0.0.1',
            'Default',
            'Userpage Bot',
            'Sannse',
            'SVG',
            'KyleH',
            'Angela',
            'URL',
            'Moli.wikia',
            'Merrystar',
            'Jack Phoenix',
            'MarkvA',
            'Exlex',
            'Grunny',
            'VegaDark',
            'Charitwo'
        ].includes(v.revisions[0].user)) {
            results.push(v.title);
        }
    });
}

function callback1(d) {
    'use strict';
    var pages = d.query.allpages.map(p => p.title);
    while(pages.length > 0) {
        api.get({
            action: 'query',
            titles: pages.splice(0, 50).join('|'),
            prop: 'revisions',
            rvprop: 'user'
        }).done(callback2);
    }
}

[2, 3].forEach(function(namespace) {
    'use strict';
    api.get({
        action: 'query',
        list: 'allpages',
        apnamespace: namespace,
        aplimit: 'max'
    }).done(callback1);
});
