$(function() {
    'use strict';
    
    var i18n = {
            /* English (English) */
            en: {
                loadStatusAlt: 'Refreshing history',
                refreshHover: 'Enable history auto-refresh',
                // should not be translated
                refreshText: 'AJAX'
            },
            /* Spanish (Español) */
            es: {
                refreshHover: 'Actualizar esta historial automáticamente'
            }
        },
        config = mw.config.get([
            'stylepath',
            'wgAction',
            'wgCanonicalSpecialPageName',
            'wgPageName',
            'wgUserLanguage'
        ]),

        ajaxIndicator = window.ajaxIndicator || config.stylepath + '/common/images/ajax.gif',
        ajaxTimer,
        ajRefresh = window.ajaxRefresh || 60000,
        href = location.href.replace(/#[\S]*/, '');
    
    if (config.wgAction !== 'history' || $('#ajaxToggle').length !== 0) {
        return;
    }
    
    function getMessage(msgKey, globalKey) {
        if (globalKey && typeof window[globalKey] === 'string') {
            return window[globalKey];
        }
        var lang = config.wgUserLanguage,
            splitLang = lang.split('-')[0];
        if (i18n[lang] && i18n[lang][msgKey]) {
            return i18n[lang][msgKey];
        }
        if (i18n[splitLang] && i18n[splitLang][msgKey]) {
            return i18n[splitLang][msgKey];
        }
        return i18n.en[msgKey];
    }
    
    function storage(setTo) {
        if (localStorage.getItem('AjaxHistory-refresh') === null) {
            localStorage.setItem('AjaxHistory-refresh', true);
        }
        if (setTo === false) {
            localStorage.setItem('AjaxHistory-refresh', false);
        } else if (setTo === true) {
            localStorage.setItem('AjaxHistory-refresh', true);
        }
        return JSON.parse(localStorage.getItem('AjaxHistory-refresh'));
    }
    
    function loadPageData() {
        var $temp = $('<div>');
        $temp.load(href + ' #mw-content-text', function() {
            var $newContent = $($temp.children()[0]);
            if ($newContent.length) {
                $('#mw-content-text').replaceWith($newContent);
                mw.util.$content = $newContent;
            }
            ajaxTimer = setTimeout(loadPageData, ajRefresh);
        });
        $temp.remove();
    }
    
    function toggleAjaxReload() {
        if ($('#ajaxToggle').prop('checked')) {
            storage(true);
            loadPageData();
        } else {
            storage(false);
            clearTimeout(ajaxTimer);
        }
    }
    
    function preloadAJAXHIS() {
        var $appTo = $('#WikiaPageHeader'),
            $checkbox = $('<span>')
                .attr('id', 'ajaxHistory')
                .css({
                    'font-size': 'xx-small',
                    'line-height': '100%',
                    'margin-left': '5px'
                })
                .append(
                    $('<label>')
                        .attr({
                            id: 'ajaxToggleText',
                            'for': 'ajaxToggle',
                            title: getMessage('refreshHover', 'AjaxRCRefreshHoverText')
                        })
                        .text(getMessage('refreshText', 'AjaxRCRefreshText') + ':')
                        .css({
                            'border-bottom': '1px dotted',
                            cursor: 'help'
                        }),
                    $('<input>')
                        .attr({
                            id: 'ajaxToggle',
                            type: 'checkbox'
                        })
                        .css('margin-bottom', 0),
                    $('<span>')
                        .attr('id', 'ajaxLoadProgress')
                        .css('display', 'none')
                        .append(
                            $('<img>')
                                .attr({
                                    alt: getMessage('loadStatusAlt', false),
                                    src: ajaxIndicator
                                })
                                .css({
                                    'vertical-align': 'baseline',
                                    float: 'none',
                                    border: 0
                                })
                        )
                ),
            $throbber;
        if ($appTo) {
            $appTo.append($checkbox);
        } else {
            $('#WikiaArticle').prepend($checkbox);
        }
        $throbber = $appTo.find('#ajaxLoadProgress');
        $(document).ajaxSend(function(_, _2, settings) {
            if (href === settings.url) {
                $throbber.show();
            }
        }).ajaxComplete(function(_, _2, settings) {
            var $collapsibleElements = $('#mw-content-text').find('.mw-collapsible'),
                ajCallAgain = window.ajaxCallAgain || [],
                i;
            if (href === settings.url) {
                $throbber.hide();
                if ($collapsibleElements.length) {
                    $collapsibleElements.makeCollapsible();
                }
                for (i = 0; i < ajCallAgain.length; i++) {
                    if ($.isFunction(ajCallAgain[i])) {
                        ajCallAgain[i]();
                    } else {
                        console.log('AjaxRC Error: Could not call non-function after reload.');
                    }
                }
            }
        });
        $('#ajaxToggle')
            .attr('checked', storage())
            .click(toggleAjaxReload);
        if (storage()) {
            loadPageData();
        }
    }
    
    preloadAJAXHIS();
    
});