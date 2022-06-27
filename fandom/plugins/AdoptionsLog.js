/**
 * Name:        AdoptionsLog
 * Description: Lists and marks all non-resolved adoptions
 *              on Special:BlankPage/AdoptionsLog
 * Author:      KockaAdmiralac <1405223@gmail.com>
 * Version:     v1.0
 * TODO:        Auto refresh, notifications
 */
(function() {
    'use strict';
    var config = mw.config.get([
        'wgCityId',
        'wgPageName'
    ]);
    if(
        config.wgPageName !== 'Special:BlankPage/AdoptionsLog' ||
        config.wgCityId !== '177'
    ) {
        return;
    }
    importArticles(
        {
            type: 'script',
            articles: [ 'u:dev:MediaWiki:UI-js/code.js' ]
        },
        {
            type: 'style',
            articles: [ 'u:kocka:MediaWiki:AdoptionsLog/code.css' ]
        }
    );
    var AdoptionsLog = {
        autoRefresh: Boolean(localStorage.getItem('refresh')),
        columns: 2,
        init: function(ui) {
            this.api = new mw.Api();
            this.ui = ui;
            if(this.autoRefresh) {
                this.refreshInterval = this.makeRefresh();
            }
            $('.header-title h1').text('Adoptions log');
            $('.header-title h2').remove();
            $('#mw-content-text').html(
                ui({
                    children: [
                        {
                            type: 'div',
                            id: 'AdoptionsLogHeader',
                            children: [
                                {
                                    type: 'p',
                                    attr: { id: 'AdoptionsLogText' },
                                    text: 'This is the log of recent adoptions'
                                },
                                {
                                    type: 'button',
                                    attr: { id: 'AdoptionsLogRefreshButton' },
                                    text: 'Refresh',
                                    events: {
                                        click: $.proxy(this.refresh, this)
                                    }
                                },
                                {
                                    type: 'input',
                                    attr: {
                                        type: 'checkbox',
                                        id: 'AdoptionsLogAutoRefresh'
                                    },
                                    events: {
                                        change: $.proxy(this.onChange, this)
                                    },
                                    checked: this.autoRefresh
                                },
                                {
                                    type: 'input',
                                    attr: {
                                        type: 'number',
                                        id: 'AdoptionsLogRefreshInterval'
                                    },
                                    events: {
                                        blur: $.proxy(this.makeRefresh, this)
                                    }
                                }
                            ]
                        },
                        {
                            type: 'table',
                            attr: { id: 'AdoptionsLogList' },
                            children: []
                        }
                    ]
                })
            );
            $.get(mw.util.wikiScript('load'), {
                mode: 'articles',
                articles: 'u:kocka:MediaWiki:Custom-adoptions-whitelist',
                only: 'styles'
            }, $.proxy(this.cbWhitelist, this));
        },
        cbWhitelist: function(d) {
            this.whitelist = JSON.parse(d.replace(/\/\*.*\*\//g, ''));
        },
        item: function(v, k) {
            var users = [],
                whitelist;
            v.forEach(function(el) {
                if(users.indexOf(el.user) === -1) {
                    users.push(el.user);
                }
            });
            var contributors = $.map(users, $.proxy(function(el) {
                return [
                    this.makeLink('Special:Contribs/' + el, el),
                    ', '
                ];
            }, this));
            contributors.unshift('Contributors: ');
            contributors.pop();
            users.forEach(function(el) {
                if(this.whitelist.indexOf(el) !== -1) {
                    whitelist = true;
                }
            }, this);
            return {
                // This is hacky but eh
                time: new Date(v[v.length - 1].timestamp),
                type: 'td',
                attr: {
                    'class': 'AdoptionsLogListItem ' + (whitelist ?
                        'AdoptionsLogWhitelist' :
                        users.length === 1 ?
                            'AdoptionsLogUnanswered' :
                            'AdoptionsLogNeedCheck')
                },
                children: [
                    this.makeLink(k, k.substring(9)),
                    {
                        type: 'p',
                        attr: {
                            'class': 'AdoptionsLogContributors'
                        },
                        children: contributors
                    }
                ]
            };
        },
        makeLink: function(link, text) {
            return {
                type: 'a',
                attr: {
                    href: mw.util.wikiGetlink(link)
                },
                text: text
            };
        },
        refresh: function() {
            if(!this.whitelist) {
                return;
            }
            $('#AdoptionsLogList').fadeOut();
            this.adoptions = {};
            this.api.get({
                action: 'parse',
                text: [
                    '<dpl>',
                        'shownamespace = false',
                        'category      = Adoption requests',
                        'namespace     = Adoption',
                    '</dpl>'
                ].join('\n'),
                prop: 'links',
                disablepp: true
            }).done($.proxy(this.cbParse, this));
        },
        cbParse: function(d) {
            if(!d.error) {
                var arr = d.parse.links;
                this.loading = arr.length;
                arr.forEach(function(el) {
                    this.api.get({
                        action: 'query',
                        prop: 'revisions',
                        titles: el['*'],
                        rvprop: 'user|timestamp|comment',
                        rvlimit: 'max',
                        cb: Math.random()
                    }).done($.proxy(this.cbRevisions, this));
                }, this);
            }
        },
        cbRevisions: function(d) {
            if(!d.error) {
                var pages = d.query.pages,
                    page = pages[Object.keys(pages)[0]];
                this.adoptions[page.title] = page.revisions;
                if(--this.loading === 0) {
                    var items = $.map(this.adoptions, $.proxy(this.item, this)),
                        children = [],
                        accumulation = [];
                    items.sort(function(a, b) {
                        return b.time - a.time;
                    });
                    items.forEach(function(el) {
                        accumulation.push(el);
                        if(accumulation.length === this.columns) {
                            children.push({
                                type: 'tr',
                                children: accumulation
                            });
                            accumulation = [];
                        }
                    }, this);
                    $('#AdoptionsLogList').html(
                        this.ui({
                            children: children
                        })
                    ).fadeIn();
                }
            }
        },
        makeRefresh: function() {
            this.killRefresh();
            this.refreshInterval = setInterval(
                $.proxy(this.refresh, this),
                $('#AdoptionsLogRefreshInterval').val()
            );
        },
        killRefresh: function() {
            if(this.refreshInterval) {
                clearInterval(this.refreshInterval);
            }
        },
        onChange: function() {
            if($('#AdoptionsLogAutoRefresh').prop('checked')) {
                this.makeRefresh();
            } else {
                this.killRefresh();
            }
        }
    };
    mw.loader.using('mediawiki.api').then(function() {
        mw.hook('dev.ui').add($.proxy(AdoptionsLog.init, AdoptionsLog));
    });
})();


