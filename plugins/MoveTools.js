/**
 * Name:        MoveTools
 * Author:      KockaAdmiralac <wikia@kocka.tech>
 * Description: Moves all tools to the edit menu dropdown or
 *              a custom community header dropdown
 */
(function() {
    // Move buttons
    mw.hook('ToggleSideBar.loaded').add(function() {
        $('.page-header__contribution-buttons .wds-list').append(
            $('<li>').append(
               $('#toggle-side-bar-button').removeAttr('class')
            )
        );
    });
    // Move toolbar buttons
    var $tools = $('#my-tools-menu');
    if ($tools.length === 0) {
        $tools = $('<ul>', {
            'class': 'tools-menu',
            id: 'my-tools-menu'
        });
        $('#WikiaBar .toolbar .tools').append(
            $('<li>', {
                'class': 'mytools menu'
            }).append($tools)
        );
    }
    var $custom = $('.wds-tabs__tab .wds-dropdown')
        .first()
        .parent()
        .clone()
        .appendTo('.wds-community-header__local-navigation .wds-tabs');
    $custom.find('.wds-tabs__tab-label span').text('Tools');
    var $customTools = $custom
        .find('.wds-list')
        .empty()
        .addClass('wds-community-header__tools');
    $('#my-tools-menu li, .toolbar .tools > li.overflow').each(function() {
        moveLink($(this));
    });
    function moveLink($li) {
        if ($li.hasClass('overflow') && $li.attr('id') !== 'massEdit-li') {
            $li.appendTo('.page-header__contribution-buttons .wds-list');
        } else {
            $li.appendTo($customTools);
        }
    }
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
            var nodes = m.addedNodes;
            nodes.forEach(function(n) {
                if ($(n).is('li')) {
                    moveLink($(n));
                }
            });
        });
    });
    observer.observe($tools.get(0), {
        childList: true
    });
    // Move notifications out of the bar
    $('#WikiaNotifications').appendTo('body');
    // Move LastEdited and PageCreator to the right
    var $headerContainer = $('<div>', {
        'class': 'page-header__info'
    }).prependTo('.page-header__main:first');
    function appendHeader($el) {
        $headerContainer.prepend($el);
    }
    mw.hook('LastEdited.inserted').add(appendHeader);
    mw.hook('PageCreator.render').add(appendHeader);
})();
