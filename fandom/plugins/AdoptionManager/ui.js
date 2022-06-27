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