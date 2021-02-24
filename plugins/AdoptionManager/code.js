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
define('adoption.io', ['jquery', 'adoption.config'], function($, config) {
    'use strict';
    return {
        init: function(parent, api) {
            this.parent = parent;
            this.api = api;
            this.getPageDetails();
        },
        query: function(action, callback, data, method) {
            data = data || {};
            data.action = action;
            this.api[method || 'get'](data)
                .done($.proxy(function(d) {
                    if (d.error) {
                        console.error('API error: ' + d.error.code + ':' + d.error.info);
                    } else {
                        this.parent['cb' + callback].call(this.parent, d[action]);
                    }
                }, this))
                .fail(function(e) {
                    console.error(e);
                });
        },
        xQuery: function(wiki, action, callback, data) {
            data = data || {};
            data.format = 'json';
            data.action = action;
            $.ajax({
                url: 'http://' + wiki + '.wikia.com/api.php',
                data: data,
                dataType: 'jsonp',
                global: false,
                context: this.parent,
                success: function(d) {
                    this['cb' + callback].call(this, d[action]);
                },
                error: function(e) {
                    console.error(e);
                }
            });
        },
        ajax: function(method, content, summary) {
            return $.ajax({
                method: 'POST',
                url: '/index.php?action=ajax&rs=EditPageLayoutAjax&title=' + encodeURIComponent(config.wgPageName),
                data: {
                    page: 'SpecialCustomEditPage',
                    method: method,
                    content: content,
                    summary: summary,
                    section: 0
                },
                dataType: 'json',
                context: this,
                global: false
            });
        },
        getPageDetails: function() {
            this.query('query', 'PageDetails', {
                titles: config.wgPageName,
                prop: 'info|revisions|categories',
                inprop: 'protection|readable|created|redirect',
                rvlimit: 'max',
                rvprop: 'ids|flags|timestamp|user|size|parsedcomment|content'                
            });
        },
        getPreview: function(content, summary) {
            return this.ajax('preview', content, summary);
        },
        getDiff: function(content) {
            return this.ajax('diff', content);
        },
        getWikiDetails: function(wiki, user) {
            this.xQuery('query', 'WikiDetails');
        },
        save: function(text, summary) {
            //
        },
        checkMove: function(title) {
            //
        },
        move: function(title, markredirect) {
            //
        }
    };
});
define('adoption.ui', ['jquery'], function($) {
    'use strict';
    return {
        init: function(parent, modal) {
            this.parent = parent;
            this.ui = window.dev.ui;
            this.uiModal = modal;
            this.content = this.createContent();
            this.button = 0;
            this.createModal();
        },
        createContent: function() {
            return this.ui({
                type: 'div',
                attr: {
                    'class': 'WikiaArticle',
                    id: 'AdoptionManagerWrapper'
                },
                children: [
                    this.div('Status'),
                    // Initialization tab
                    this.form('Initialization', 'Enter the user\'s username and the subdomain of the wiki they are trying to adopt', [
                        this.input('username', 'Username'),
                        this.input('wiki', 'Wiki subdomain (For example, in http://mlp.wikia.com, "mlp" is the subdomain)')
                    ], true),
                    // Information & Response tab
                    this.form('Information', 'You can edit the fetched information here.', [
                        this.header('Information'),
                        this.input('admin', 'Administrator who last edited on the wiki'),
                        this.input('lastEdit', 'Date when the administrator last edited'),
                        this.input('edits', 'How many edits the user has'),
                        this.input('other', 'Other information'),
                        this.header('Response'),
                        {
                            type: 'select',
                            attr: {
                                id: 'AdoptionManagerSelectTemplate'
                            },
                            children: $.map(this.parent.templates, this.responseMap),
                            events: {
                                change: this.selectTemplate
                            }
                        },
                        this.input('response', 'Response content')
                        // Fields
                    ]),
                    // Source tab
                    this.form('Source', 'You can edit the actual page contents here.', [
                        this.input('summary', 'Enter the edit summary here'),
                        {
                            type: 'textarea',
                            attr: {
                                id: 'AdoptionManagerContents',
                                name: 'content'
                            }
                        }
                    ]),
                    // Preview tab
                    this.form('Preview', 'These are the differences between the contents to be inserted into the page and existing page contents, and the page preview.', [
                        this.header('Differences'),
                        this.div('Diff'),
                        this.header('Preview'),
                        this.div('Preview'),
                        this.div('Preview')
                    ])
                ]
            });
        },
        div: function(id) {
            return {
                type: 'div',
                attr: {
                    id: 'AdoptionManager' + id
                }
            };
        },
        form: function(name, text, children, active) {
            children.unshift({
                type: 'p',
                text: text
            });
            return {
                type: 'form',
                attr: {
                    'class': 'WikiaForm tab ' + (active ? 'active' : ''),
                    id: 'AdoptionManagerForm' + name
                },
                children: children
            };
        },
        header: function(text) {
            return {
                type: 'h2',
                text: text
            };
        },
        input: function(name, text) {
            return {
                type: 'div',
                attr: {
                    'class': 'input-group'
                },
                children: [
                    {
                        type: 'label',
                        attr: {
                            'for': name
                        },
                        text: text
                    },
                    {
                        type: 'input',
                        attr: {
                            type: 'text',
                            name: name
                        }
                    }
                ]
            };
        },
        responseMap: function(k, v) {
            return {
                type: 'option',
                data: {
                    content: v
                },
                text: k
            };
        },
        createModal: function() {
            this.uiModal.createComponent({
                vars: {
                    id: 'AdoptionManagerModal',
                    content: this.content.outerHTML,
                    size: 'large',
                    title: 'Adoption management',
                    buttons: [
                        {
                            vars: {
                                value: 'Next',
                                id: 'AdoptionManagerButtonNext',
                                classes: ['normal', 'primary'],
                                data: [{
                                    key: 'event',
                                    value: 'next'
                                }]
                            }
                        },
                        {
                            vars: {
                                value: 'Previous',
                                id: 'AdoptionManagerButtonPrevious',
                                classes: ['normal', 'primary'],
                                data: [{
                                    key: 'event',
                                    value: 'previous'
                                }]
                            }
                        },
                        {
                            vars: {
                                value: 'Close',
                                data: [{
                                    key: 'event',
                                    value: 'close'
                                }]
                            }
                        }
                    ]
                },
                confirmCloseModal: $.proxy(this.parent.close, this)
            }, $.proxy(this.parent.cbCreateModal, this.parent));
        },
        insertButton: function() {
            console.log(this.button);
            if (this.button++ !== 1) {
                return;
            }
            $('.page-header__contribution-buttons').append(this.ui({
                type: 'a',
                attr: {
                    'class': 'wds-button wds-is-squished wds-is-secondary',
                    id: 'AdoptionManagerButton'
                },
                events: {
                    click: $.proxy(this.parent.click, this.parent)
                },
                text: 'Format'
            }));
            this.inserted = true;
        },
        switchTab: function(tab) {
            $('#AdoptionManagerWrapper .tab.active').removeClass('active');
            $('#AdoptionManagerWrapper .tab:nth-of-type(' + tab + ')').addClass('active');
        },
        selectTemplate: function(e) {
            $('[name="response"]').val(
                $(
                    $(e.target).prop('selectedOptions')[0]
                ).data('content')
            );
        },
        formData: function(form) {
            var arr = $('#AdoptionManagerForm' + form).serializeArray(),
                ret = {};
            arr.forEach(function(el) {
                ret[el.name] = el.value;
            });
            return ret;
        }
    };
});
require(['jquery', 'mw', 'wikia.window', 'wikia.ui.factory', 'adoption.config', 'adoption.ui', 'adoption.io'], function(
    $,
    mw,
    window,
    uiFactory,
    config,
    ui,
    io
) {
    'use strict';
    var AdoptionManager = {
        config: $.extend({
            markredirect: false
        }, window.AdoptionManagerConfig),
        titles: ['Adoption Manager', 'Information & Response', 'Source', 'Preview'],
        templates: $.extend({
            'Active Admins': '<!-- Hey, there are active administrators on that wiki so you can\'t adopt it muahahaha -->',
            'Nope': 'If I actually reply with this it was just a script test sorry'
        }),
        init: function(modal) {
            this.tab = 0;
            io.init(this, new mw.Api());
            ui.init(this, modal);
        },
        close: function() {
            if (!confirm('Are you sure you want to close the modal?')) {
                return false;
            }
            this.modal = null;
            console.log('modal closed');
            ui.createModal();
            return true;
        },
        cbCreateModal: function(modal) {
            console.log('modal created');
            // This is so stupid but DRY
            ['next', 'previous'].forEach(function(el) {
                modal.bind(el, $.proxy(this[el], this));
            }, this);
            var $buttons = modal.$element.find('> footer > .buttons');
            this.nextButton = $buttons.find('#AdoptionManagerButtonNext');
            this.previousButton = $buttons
                .find('#AdoptionManagerButtonPrevious')
                .attr('disabled', 'true');
            this.modal = modal;
            ui.insertButton();
        },
        next: function() {
            this.modal.deactivate();
            var data;
            switch (++this.tab) {
                case 1:
                    this.nextButton.removeAttr('disabled');
                    data = ui.formData('Initialization');
                    io.getWikiDetails(data.wiki, data.username);
                    break;
                case 2:
                    data = ui.formData('Information');
                    break;
                case 3:
                    data = ui.formData('Source');
                    $.when(
                        io.getPreview(data.content, data.summary),
                        io.getDiff(data.content)
                    ).done($.proxy(this.preview, this));
                    break;
                case 4:
                    if (new mw.Title(this.title).title !== new mw.Title(config.wgPageName).title) {
                        io.checkMove(this.title);
                    }
                    return;
            }
            ui.switchTab(this.tab);
            this.modal.setTitle(this.titles[this.tab]);
        },
        previous: function() {
            if (--this.tab === 0) {
                this.previousButton.attr('disabled', 'true');
            } else {
                this.previousButton.removeAttr('disabled');
            }
            ui.switchTab(this.tab);
        },
        cbPageDetails: function(d) {
            var pages = d.pages,
                data = pages[Object.keys(pages)[0]];
            if (data.missing === '' || data.readable !== '') {
                return;
            }
            this.data = data;
            ui.insertButton();
        },
        click: function() {
            if (this.modal) {
                this.modal.show();
            } else {
                alert('Wait a bit and click again!');
            }
        },
        preview: function(preview, diff) {
            $('#AdoptionManagerDiff').html(diff.html);
            $('#AdoptionManagerPreview').html(preview.html);
        },
        save: function() {
            console.log('save');
        }
    };
    $.when(
        uiFactory.init(['modal']),
        mw.loader.using(['mediawiki.api.edit', 'mediawiki.action.history.diff'])
    ).done($.proxy(AdoptionManager.init, AdoptionManager));
});
console.clear();