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
            ui.createModal();
            return true;
        },
        cbCreateModal: function(modal) {
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
        cbWikiDetails: function() {

        },
        errWikiDetails: function(err, data) {
            if (data) {

            } else {
                
            }
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