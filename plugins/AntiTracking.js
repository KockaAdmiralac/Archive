/**
 * Name:        AntiTracking
 * Version:     v1.3
 * Author:      KockaAdmiralac <wikia@kocka.tech>
 *              452 (edit form submission fixes)
 * Description: This script prevents FANDOM trackers from tracking you
 */
(function() {
    // It doesn't support Ace properly... yet
    if ($('#editarea.ace_editor').length) {
        return;
    }
    $('#editform').off('submit').on('submit', function() {
        $(window).unbind('.leaveconfirm');
    });
    if (window.Wikia && window.Wikia.Tracker) {
        Wikia.Tracker.track = function(obj) {
           mw.log('FANDOM tried to track you:', obj);
        };
    }
    if (window.WikiaEditor) {
        WikiaEditor.track = function(obj) {
            mw.log('WikiaEditor tried to track you:', obj);
        };
    }
    if (window.define) {
        define('wikia.trackingOptIn', $.noop);
    }
    Wikia.AbTest = {
        getExperiments: function() {
            return [];
        },
        inGroup: function() {
            return false;
        }
    };
    Wikia.log = $.noop;
    Wikia.log.levels = {
        info: 0
    };
})();
// </syntaxhighlight>
