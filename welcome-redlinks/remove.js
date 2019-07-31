var api = new mw.Api(),
    pages,
    pageC = {},
    regex = /auf der Seite (?:\[\[:([^\|\]]+)\|([^\]]+)\]\]|\[\[:?([^\]]+)\]\])/,
    keys,
    interval = 10000,
    summary = 'Removing redlinks',
    debug = true;

function init() {
    console.log('Editing pages...');
    $.each(pageC, function(k, v) {
        var match = regex.exec(v);
        regex.lastIndex = 0;
        if (!match) {
            console.error(v);
        } else {
            pageC[k] = v
                .replace(regex, 'auf der Seite \'\'\'' + (match[3] || match[2] || match[1]) + '\'\'\'')
                .replace('<ac_metadata title="Begrüßung eines neuen Clashers"> </ac_metadata>', '')
                .replace('<ac_metadata title="Begrüßung eines neuen Autors"> </ac_metadata>', '');
        }
    });
    keys = Object.keys(pageC);
    setInterval(remove, interval);
}

function remove() {
    var page = keys.shift();
    if (debug) {
        console.log('Editing Thread:' + page + ' with contents:\n' + pageC[page] + '\n------------------------');
    } else {
        $.nirvana.postJson('WallExternal', 'editMessageSave', {
            msgid: Number(page),
            newtitle: 'Begrüßung eines neuen Clashers',
            newbody: pageC[page],
            pagetitle: page,
            pagenamespace: 1201,
            token: mw.user.tokens.get('editToken')
        }, function(d) {
            if (d.status) {
                console.log('Successfully edited Thread:' + page + '!');
            } else {
                console.error('An error occurred while editing Thread:' + page + ':', d);
            }
        });
    }
}

function contents(d) {
    if (pages.length === 0) {
        init();
        return;
    }
    if (d) {
        $.each(d.query.pages, function(k, v) {
            if (!v.revisions) {
                console.log(v);
                return;
            }
            pageC[k] = v.revisions[0]['*'];
        });
    }
    api.get({
        action: 'query',
        prop: 'revisions',
        rvprop: 'content',
        pageids: pages.splice(0, 50).join('|')
    }).done(contents);
}

$.get('https://gist.githubusercontent.com/KockaAdmiralac/45f7b1b686527407d52fba2409a35f26/raw/7471104b68d22b08e8c8dcdf7d93159c587981eb/redlinks.txt', function(d) {
    console.log('Fetching contents of pages with redlinks...');
    pages = d.trim().split('\n');
    contents();
});

console.log('Fetching pages with redlinks...');
