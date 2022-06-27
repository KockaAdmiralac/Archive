// <syntaxhighlight lang="javascript">
$(function() {
    if(mw.config.get('wgCanonicalSpecialPageName') !== "Recentchanges") {
        return;
    }
    var PatrolAll = {
        i18n: {
            error: 'An error occurred while',
            errorFetch: 'fetching revisions',
            errorPatrol: 'patrolling revision',
            patrolAll: 'Patrol All',
            patrolled: 'Patrolling everything ended!',
            nothing: 'Nothing to patrol!'
        },
        init: function() {
            mw.loader.using('mediawiki.api').then($.proxy(function() {
                this.api = new mw.Api();
                this.insertUI();
            }, this));
        },
        findPages: function() {
            this.api.get({
                action: 'query',
                list: 'recentchanges',
                rctype: 'new|edit',
                rclimit: 500,
                rctoken: 'patrol',
                rcprop: 'patrolled|ids',
                rcshow: '!patrolled'
            }).done($.proxy(function(d) {
                if(d.error) {
                    this.error('fetch', d.error.code);
                } else {
                    var data = d.query.recentchanges;
                    if(data.length === 0) {
                        new BannerNotification(this.i18n.nothing, 'confirm').show();
                        return;
                    }
                    var token = data[0].patroltoken;
                    this.revisions = data.length;
                    data.forEach(function(el) {
                        this.patrol(el.rcid, token);
                    }, this);
                }
            }, this)).fail($.proxy(function() {
                this.error('fetch');
            }));
        },
        error: function(msg, code) {
            new BannerNotification(this.i18n + ' ' + this.i18n['error' + msg] + (code || 'ajax'), 'error').show();
        },
        patrol: function(rcid, token) {
            this.api.post({
                action: "patrol",
                token: token,
                rcid: rcid
            }).done($.proxy(function(d) {
                if(d.error) {
                    this.error('patrol', d.error.code);
                } else if(--this.revisions === 0) {
                    new BannerNotification(this.i18n.patrolled, 'confirm').show();
                }
            }, this)).fail($.proxy(function() {
                this.error('patrol');
            }, this));
        },
        insertUI: function() {
            $("#ajaxRefresh").parent().append(mw.html.element('button', { id: "PatrolAllButton" }, this.i18n.patrolAll));
            $("#PatrolAllButton").click($.proxy(this.findPages, this));
        }
    };
    PatrolAll.init();
});
// </syntaxhighlight>
