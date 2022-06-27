// <syntaxhighlight lang="javascript">
// globals $, mw, BannerNotification, require
// jshint multistr: true
/**
 * Name:            MessageWallActions
 * Version:         v1.0
 * Author(s):       KockaAdmiralac <1405223@gmail.com>
 * Description:     Adds utilities for managing Message Walls effectively
 */
$(function()
{
    if(mw.config.get('wgNamespaceNumber') !== mw.config.get('wgNamespaceIds').message_wall) return;
    $.get("/load.php", { mode: "articles", articles: "u:kocka:MediaWiki:Custom-plugin-i18n/MessageWallActions.json", only: "styles" }, function(d)
    {
        var i18n = JSON.parse(d.replace(/\/\*.*\*\//g, "")),
        MessageWallActionsApiInterval = setInterval(function()
        {
            if(typeof mw !== 'undefined' && typeof mw.Api !== 'undefined')
            {
                clearInterval(MessageWallActionsApiInterval);
                var lang = mw.config.get('wgUserLanguage'),
                    langConfig = i18n[i18n[lang] ? lang : "en"];
                if(typeof langConfig === 'string') langConfig = i18n[langConfig];
                doStuff(langConfig);
            }
        }, 100);
    });
    function doStuff(i18n)
    {
        var MessageWallActions = {
            api: new mw.Api(),
            config: $.extend({
                deleteReason: "Deleting Message Wall",
                nukeReason: "Nuking Message Wall",
                redirectSummary: "Redirecting Message Wall",
                unredirectSummary: "Removing redirect from Message Wall"
            }, window.MessageWallActionsConfig),
            i18n: $.extend(i18n, window.MessageWallActionsVocab),
            pageName: mw.config.get('wgPageName'),
            editToken: mw.user.tokens.get('editToken'),
            threads: [],
            init: function()
            {
                mw.util.addCSS(".hidden-tab{display:none}");
                this.insertUI();
            },
            apiCall: function(method, error, params, callback)
            {
                this.api[method](params).done($.proxy(function(d)
                {
                    if(d.error) this.showError(error, d.error.code);
                    else if(typeof callback === 'undefined') this.showSuccess(error);
                    else callback.call(this, d);
                }, this)).fail($.proxy(function() { this.showError(error); }, this));
            },
            showNotification: function(text, type) { new BannerNotification(text, type).show(); },
            showError: function(error, add) { if(!this.config.hideErrors) this.showNotification(this.i18n.error + " " + this.i18n[error + "Error"] + (add ? ": " + add : ""), 'error'); },
            showSuccess: function(text) { this.showNotification(this.i18n.success + " " + this.i18n[text + "Success"] + "!", 'success'); },
            getNextThread: function(callback, next)
            {
                if(this.fetchedThreads) callback.call(this);
                else
                {
                    this.apiCall("get", "fetchThread", {
                        action: "query",
                        list: "allpages",
                        apfrom: next,
                        apprefix: this.pageName.split(":")[1],
                        apnamespace: 1201,
                        apfilterredir: "nonredirects" // TO DO: Resolve broken redirects if wall is nuked
                    }, function(d)
                    {
                        console.log(this);
                        this.threads = this.threads.concat(d.query.allpages.map(function(el){ return el.title; }));
                        if(d["query-continue"]) this.getNextThread(callback, d["query-continue"].allpages.apfrom);
                        else
                        {
                            this.fetchedThreads = true;
                            callback.call(this);
                        }
                    });
                }
            },
            insertUI: function()
            {
                $(".details").append("<li><button id='MessageWallActionsButton'>" + this.i18n.messageWallActions + "</button></li>");
                $("#MessageWallActionsButton").click($.proxy(this.showModal, this));
            },
            showModal: function()
            {
                require(['wikia.ui.factory'], function (uiFactory) { uiFactory.init(['modal']).then(function (modal)
                {
                    modal.createComponent({
                        vars: {
                            id: "MessageWallActionsModal",
                            // X_X
                            content: "<ul class='tabs'>\
                                <li data-tab='redirect' class='selected'><a href='#'>{{#redirectText}}</a></li>\
                                <li data-tab='delete'><a href='#'>{{#deleteText}}/{{#nukeText}}</a></li>\
                                <li data-tab='unredirect'><a href='#'>{{#unredirectText}}</a></li>\
                            </ul>\
                            <ul class='tab-content'>\
                                <li id='tab-redirect'>\
                                    <p>{{#redirectDesc}}</p><br/>\
                                    <input type='text' id='MessageWallActionsRedirectTo'/>\
                                </li>\
                                <li id='tab-delete' class='hidden-tab'>\
                                    <p>{{#deleteDesc}}</p><br/>\
                                    <select id='MessageWallActionsDeleteSelect'>\
                                        <option>{{#nothingText}}</option>\
                                        <option>{{#deleteText}}</option>\
                                        <option>{{#nukeText}}</option>\
                                        <option>{{#deleteText}} & {{#nukeText}}</option>\
                                    </select>\
                                </li>\
                                <li id='tab-unredirect' class='hidden-tab'>\
                                    <p>{{#unredirectDesc}}</p>\
                                </li>\
                            </ul>".replace(/{{#(\w+)}}/g, function(a, b) { return this.i18n[b]; }.bind(MessageWallActions)),
                            size: 'medium',
                            title: this.i18n.modalTitle,
                            buttons: [{
                                vars: {
                                    value: this.i18n.execute,
                                    classes: ['normal', 'primary'],
                                    data: [{
                                        key: 'event',
                                        value: 'execute'
                                    }]
                                }
                            },
                            {
                                vars: {
                                    value: this.i18n.cancel,
                                    data: [{
                                        key: 'event',
                                        value: 'close'
                                    }]
                                }
                            }]
                        }
                    },
                    function (messageWallModal)
                    {
                        messageWallModal.bind('execute', this.execute.bind(this));
                        var tab = messageWallModal.$element.find('.tabs a');
                        tab.click(this.switchTab);
                        messageWallModal.show();
                    }.bind(this));
                }.bind(this)); }.bind(this));
            },
            switchTab: function(event)
            {
                event.preventDefault();
                var clicked = $(this).closest('li'), tabs = clicked.closest('ul');
                tabs.children('li').each(function()
                {
                    var that = $(this);
                    that.removeClass('selected');
                    $("#tab-" + that.data().tab).addClass('hidden-tab');
                });
                $("#tab-" + clicked.data().tab).removeClass('hidden-tab');
                clicked.addClass('selected');
            },
            execute: function()
            {
                switch($("#MessageWallActionsModal .tabs .selected").data().tab)
                {
                    case "redirect": return this.executeRedirect();
                    case "unredirect": return this.removeRedirect();
                    case "delete":
                        var index = $("#MessageWallActionsDeleteSelect").prop('selectedIndex');
                        if(index === 1 || index === 3) this.deleteWall();
                        if(index === 2 || index === 3) this.nukeWall();
                        break;
                    default:
                        console.log("lol fail");
                        break;
                }
            },
            deleteWall: function()
            {
                this.apiCall("post", "delete", {
                    action: "delete",
                    title: this.pageName,
                    reason: this.config.deleteReason,
                    bot: true,
                    token: this.editToken
                });
            },
            nukeWall: function() { this.getNextThread(function() { this.deleteNextThread(0); }); },
            deleteNextThread: function(index)
            {
                if(index === this.threads.length)
                {
                    this.showSuccess("nuke");
                    return;
                }
                this.apiCall("post", "nuke", {
                    action: "delete",
                    title: this.threads[index],
                    token: this.editToken,
                    reason: this.config.nukeReason,
                    bot: true
                }, function(d) { this.deleteNextThread(index + 1); });
            },
            executeRedirect: function()
            {
                var val = $("#MessageWallActionsRedirectTo").val();
                $.ajax({
                    url: mw.util.wikiScript('index'),
                    data: {
                        action: "raw",
                        title: "Message Wall:" + val
                    },
                    success: $.proxy(function()
                    {
                        this.apiCall("post", "redirect", {
                            action: "edit",
                            title: this.pageName,
                            text: "#REDIRECT [[Message Wall:" + val + "]]",
                            token: this.editToken,
                            summary: this.config.redirectSummary,
                            bot: true,
                            minor: true
                        });
                    }, this),
                    error: $.proxy(function(){ this.showError("redirect", this.i18n.noMWError); }, this)
                });
            },
            removeRedirect: function()
            {
                $.ajax({
                    url: mw.util.wikiScript('index'),
                    data: {
                        action: "raw",
                        title: this.pageName
                    },
                    success: function(data)
                    {
                        if(data.trim() === "") this.showError("unredirect", this.i18n.noRedirectError);
                        else this.apiCall("post", "unredirect", {
                            action: "edit",
                            title: this.pageName,
                            text: "",
                            token: this.editToken,
                            summary: this.config.unredirectSummary,
                            bot: true,
                            minor: true
                        });
                    }.bind(this),
                    error: $.proxy(function() { this.showError("unredirect", this.i18n.noRedirectError); }, this)
                });
            }
        };
        MessageWallActions.init();
    }
});
// </syntaxhighlight>


