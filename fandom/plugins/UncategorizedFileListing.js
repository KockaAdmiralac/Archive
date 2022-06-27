/**
 * Name:        UncategorizedFileListing (previously ImageNotification)
 * Version:     v1.1
 * Author:      KockaAdmiralac <1405223@gmail.com>
 * Description: Script listing all used but uncategorized files.
 *              Requires DPL ([[Help:DPL]]) to be enabled on the wiki
 */

(function() {
    // Limiting the script's scope
    if(mw.config.get('wgPageName') !== 'Special:BlankPage/UncategorizedFileListing') {
        return;
    }
    /**
     * Main object
     */
    var UncategorizedFileListing = {
        // Configuration
        config: $.extend({
            // If to announce errors that happen during the fetch
            announceError: false,
            // Image shown on the button when refreshing
            refreshImage: "https://images.wikia.nocookie.net/__cb1464990246/common/skins/common/images/ajax.gif",
            // How many DPLs to run
            fetchLimit: 10
        }, window.UncategorizedFileListingConfig),
        /**
         * Preloading i18n data and waiting for mw.Api to get defined
         */
        preload: function() {
            $.get("/load.php", { mode: "articles", articles: "u:kocka:MediaWiki:Custom-plugin-i18n/UncategorizedFileListing.json", only: "styles" }, $.proxy(function(d) {
                var i18n = JSON.parse(d.replace(/\/\*.*\*\//, "")),
                    lang = mw.config.get('wgUserLanguage');
                this.i18n = $.extend(i18n.en, i18n[lang.split("-")[0]], i18n[lang]);
                mw.loader.using('mediawiki.api').then($.proxy(this.init, this));
            }, this));
        },
        /**
         * Initializing
         */
        init: function() {
            this.api = new mw.Api();
            this.insertUI();
            this.generateDPL();
        },
        /**
         * Initializes the user interface, the refresh button and the list
         */
        insertUI: function() {
            $(skin === 'oasis' ? '.header-title h1' : '#firstHeading').text(this.i18n.title);
            $("#mw-content-text").html(mw.html.element("div", { id: "UncategorizedFileListingMain" }));
            $("#UncategorizedFileListingMain").html(
                mw.html.element("button", { id: "UncategorizedFileListingButton" }, this.i18n.refresh) + ' ' +
                mw.html.element("div", { id: "UncategorizedFileListingLabel" }) +
                mw.html.element("div", { id: "UncategorizedFileListingList" })
            );
            $("#UncategorizedFileListingButton").click($.proxy(this.refreshList, this));
            $("#UncategorizedFileListingLabel").append(mw.html.element("div", { id: "UncategorizedFileListingProgress" }));
            mw.util.addCSS("#UncategorizedFileListingList{border:1px solid black;padding:5px}#UncategorizedFileListingLabel{margin:10px;width:500px;background-color:green;height:10px;padding:1px}#UncategorizedFileListingProgress{background-color:white;height:10px;width:0}");
        },
        generateDPL: function() {
            this.dpl = "";
            for(var i = 0; i < this.config.fetchLimit; ++i) {
                this.dpl += "<dpl>\nnamespace=File\nnotcategoryregexp=.\nformat=,*[[%PAGE%]]\\n,\noffset=" + (i * 500) + "\n</dpl>";
            }
        },
        apiCall: function(method, options, error, callback, final) {
            var errorText = this.i18n.error + " " + this.i18n[error + 'Error'];
            this.api[method](options).done($.proxy(function(d) {
                if(d.error) {
                    new BannerNotification(errorText + ": " + d.error.code, "error").show();
                } else {
                    callback.call(this, d);
                    if(typeof final === 'function') {
                        final.call(this);
                    }
                }
            }, this)).fail($.proxy(function() {
                if(this.config.announceError) {
                    new BannerNotification(errorText, "error").show();
                }
                if(typeof final === 'function') {
                    final.call(this);
                }
            }, this));
        },
        refreshList: function() {
            $("#UncategorizedFileListingButton").html(mw.html.element("img", {
                alt: this.i18n.refreshing,
                src: this.config.refreshImage
            }));
            $("#UncategorizedFileListingList").html("");
            this.apiCall('get', {
                action: "parse",
                text: this.dpl
            }, 'pageFetch', function(d) {
                var array = d.parse.links.map(function(el) { return el["*"]; });
                this.tempCount = array.length;
                this.tempMax = array.length;
                // TODO: This is a very bad idea if there are a lot of files
                array.forEach($.proxy(this.getUses, this));
            });
        },
        /**
         * Get uses of a file
         * @param {String} page The file page
         */
        getUses: function(page) {
            this.apiCall('get', {
                action: "parse",
                text: "<dpl>imageused=" + page + "</dpl>"
            }, 'backlink', function(d) {
                if(d.parse.links.length > 0) {
                    $("#UncategorizedFileListingList").append(
                        mw.html.element("a", {
                            class: "UncategorizedFileListingFile",
                            href: "/wiki/" + encodeURIComponent(page)
                        }, page) +
                        mw.html.element("br")
                    );
                }
            }, function() {
                if(--this.tempCount === 0) {
                    $("#UncategorizedFileListingButton").html(this.i18n.refresh);
                }
                this.updateBar();
            });
        },
        /**
         * Updates the progress bar
         */
        updateBar: function() {
            $("#UncategorizedFileListingProgress").css("width", ((1 - (this.tempCount / this.tempMax)) * 500) + "px");
        }
    };
    $($.proxy(UncategorizedFileListing.preload, UncategorizedFileListing));
})();


