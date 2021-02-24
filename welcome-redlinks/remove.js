var api = new mw.Api(),
    pages,
    pageC = {},
    regex = /Welcome \[\[\:(.*?)\]\]/,
    keys,
    interval = 10000,
    summary = 'Removing redlinks',
    debug = false;

function init() {
    console.log('Editing pages...');
    $.each(pageC, function(k, v) {
        var match = regex.exec(v);
        if (!match) {
            console.error(v);
        } else {
            pageC[k] = v
                .replace(regex, 'Welcome ' + match[1] + '')
                .replace(/<ac_metadata title="[^"]+"> <\/ac_metadata>\s*$/, '');
        }
    });
    keys = Object.keys(pageC);
    setInterval(remove, interval);
}

function remove() {
    var page = keys.shift();
    if (debug) {
        console.log('Editing Thread:' + page + ' with contents:\n' + pageC[page]);
    } else {
        $.nirvana.postJson('WallExternal', 'editMessageSave', {
            msgid: Number(page),
            newtitle: 'Welcome to Forge of Empires Wiki!',
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

$.get('https://gist.githubusercontent.com/KockaAdmiralac/e91e0fad2f8c2c810a0a80876f64bc48/raw/f7b6c2ca358a1ec7c157d7c20b688337e8d703ae/redlinks.txt', function(d) {
    console.log('Fetching contents of pages with redlinks...');
    pages = d.trim().split('\n');
    contents();
});

console.log('Fetching pages with redlinks...');
