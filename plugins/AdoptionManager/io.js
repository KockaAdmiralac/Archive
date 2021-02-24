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
            $.ajax({
                method: 'GET',
                url: 'http://kocka.dilfa.com/adoptions/' + wiki,
                data: { user: user },
                dataType: 'json',
                context: this,
                global: false,
                success: this.cbWikiDetails,
                error: this.errWikiDetails
            });
        },
        cbWikiDetails: function(data) {
            if (data.error) {
                this.parent.errWikiDetails(data, true);
            } else {
                this.parent.cbWikiDetails(
                    data.sitename,
                    data.admin.name,
                    new Date(data.admin.last * 1000),
                    data.edits,
                    new Date(data.since)
                );
            }
        },
        errWikiDetails: function() {
            
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