/**
 * Name:        RevertToOldid
 * Author:      KockaAdmiralac <1405223@gmail.com>
 *              Noreplyz
 * Description: Reverts all pages on a wiki back to the last
 *              non-vandalized oldid. Made for use on Yokai Watch Wiki,
 *              back when an issue with 500+ vandalbots occurred.
 *              DO NOT USE THIS SCRIPT IF YOU HAVE NO VANDALBOT ISSUE.
 */
var api = new mw.Api(), array = [], index = 0, config = {
/**** CONFIGURATION OPTIONS: MODIFIABLE SECTION ****/
    // URL from which to gather the list of pages
    // Must be set in order for script to work
    // @type {String}
    listurl: '',
    // Last non-vandalized revision ID
    // Must be set in order for script to work
    // @type {Number}
    oldid: null,
    // How many concurrent requests can run
    // @type {Number}
    concurrent: 20,
    // Undo summary
    // @type {String}
    summary: 'cleanup'
/**** END CONFIGURATION: DO NOT MODIFY BELOW UNLESS YOU KNOW WHAT YOU ARE DOING ****/
};
console.clear();
function resolve() {
    var page = array[index++];
    if(typeof page === 'undefined') {
        console.info('Found no further pages, exiting process...');
        return;
    }
    api.get({
        action: 'query',
        prop: 'revisions',
        titles: page,
        rvprop: 'ids|user',
        rvendid: config.oldid,
        rvlimit: 5000
    }).done(function(d) {
        if(d.error) {
            console.warn('API error occurred while gathering the list of pages: ' + d.error.code);
            resolve();
        } else {
            try {
                var pages = d.query.pages,
                    revisions = pages[Object.keys(pages)[0]].revisions,
                    badrevid = revisions[0].revid,
                    bestrevid = revisions[revisions.length - 1].parentid;
                api.post({
                    action: 'edit',
                    title: page,
                    token: mw.user.tokens.get('editToken'),
                    summary: config.summary,
                    bot: true,
                    undo: badrevid,
                    undoafter: bestrevid
                }).done(function(d) {
                    if(d.error) {
                        console.warn('API error occurred while editing ' + page + ': ' + d.error.code);
                    }
                    resolve();
                }).fail(function() {
                    console.warn('AJAX error occurred while editing' + page);
                    resolve();
                });
            } catch (e) {
                console.warn('Error occurred while processing ' + page + ' continuing...');
                console.error(e);
                resolve();
            }
        }
    }).error(function() {
        console.warn('AJAX error occurred while gathering the list of pages');
        resolve();
    });
}
$.get(config.listurl, function(d) {
    // Just in case an idiot finds this script
    var start = false, groups = mw.config.get('wgUserGroups');
    ['vstf', 'sysop', 'content-moderator', 'rollback', 'helper', 'staff', 'util'].forEach(function(el) {
        if(!start && groups.includes(el)) {
            start = true;
            return;
        }
    });
    if(!start) {
        console.error('Insufficent permissions for running the script, exiting...');
    }
    if(!config.oldid) {
        console.error('config.oldid not set, exiting...');
    }
    array = d.split('\n');
    for(var i = 0; i < config.concurrent; ++i) {
        resolve();
    }
});
