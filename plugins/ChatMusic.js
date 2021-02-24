(function() {
    'use strict';
    var config = mw.config.get([
        'wgCanonicalSpecialPageName',
        'wgUserName'
    ]);
    if(config.wgCanonicalSpecialPageName !== 'Chat') {
        return;
    }
    importArticles({
        type: 'script',
        articles: [
            'u:dev:MediaWiki:I18n-js/code.js',
            'u:dev:MediaWiki:UI-js/code.js'
        ]
    });
    var Music = {
        _loadCounter: 2,
        preload: function() {
            if(--this._loadCounter === 0) {
                window.dev.i18n.loadMessages('ChatMusic').done($.proxy(this.init, this));
            }
        },
        init: function(i18n) {
            this.i18n = i18n;
            this.ui = window.dev.ui;
            this.initUI();
            this.initListener();
        },
        initUI: function() {
            mw.util.addCSS(
                '#ChatMusicInput {' +
                    'width: 140px;' +
                '}'
            );
            $('#Rail').prepend(
                this.ui({
                    type: 'div',
                    attr: { id: 'ChatMusic' },
                    children: [
                        {
                            type: 'span',
                            attr: { id: 'ChatMusicText' },
                            text: this.msg('name')
                        },
                        {
                            type: 'input',
                            attr: {
                                type: 'text',
                                id: 'ChatMusicInput',
                                placeholder: this.msg('placeholder')
                            },
                            events: { keydown: $.proxy(this.keydown, this) }
                        },
                        {
                            type: 'span',
                            attr: {
                                'class': 'button',
                                id: 'ChatMusicPlayButton'
                            },
                            text: this.msg('play'),
                            events: { click: $.proxy(this.playClick, this) }
                        },
                        {
                            type: 'span',
                            attr: {
                                'class': 'button',
                                id: 'ChatMusicJoinButton'
                            },
                            text: this.msg('join'),
                            events: { click: $.proxy(this.joinClick, this) }
                        }
                    ]
                })
            );
        },
        keydown: function(e) {
            if(e.keyCode === 13) {
                var value = $(e.target).val();
                if(value) {
                    this.play(value, true);
                } else if(this.audio) {
                    this.pause();
                }
            }
        },
        joinClick: function() {
            this.listening = !this.listening;
            $('#ChatMusicJoinButton').text(this.msg(this.listening ? 'leave' : 'join'));
            if(!this.listening) {
                this.pause();
            }
        },
        playClick: function() {
            if(this.audio && !this.audio.paused) {
                this.pause();
            } else {
                this.play($('#ChatMusicInput').val(), true);
            }
        },
        play: function(url, local) {
            if(this.audio) {
                this.audio.pause();
            }
            $('#ChatMusicPlayButton').text(this.msg('stop'));
            this.dispatchPlayer(url);
            this.audio = new Audio(url);
            if(typeof Promise !== 'undefined') {
                this.audio.play()['catch']($.proxy(function() {
                    if(local) {
                        alert('Audio source invalid!');
                    }
                    this.pause();
                }, this));
            } else {
                this.audio.play();
            }
            if(local && this.listening && typeof mainRoom !== 'undefined') {
                mainRoom.socket.send(new window.models.SetStatusCommand({
                    statusState: 'music',
                    statusMessage: url
                }).xport());
            }
        },
        dispatchPlayer: function(url) {
            try {
                url = new mw.Uri(url);
            } catch(e) {
                // Maybe it's a YouTube video ID?
            }
        },
        pause: function() {
            if(this.audio) {
                this.audio.pause();
            }
            $('#ChatMusicPlayButton').text(this.msg('play'));
        },
        initListener: function() {
            if(typeof mainRoom !== 'undefined') {
                mainRoom.socket.bind('updateUser', $.proxy(function(d) {
                    var data = JSON.parse(d.data).attrs;
                    if(this.listening && data.name !== config.wgUserName && data.statusState === 'music') {
                        this.play(data.statusMessage);
                    }
                }, this));
            }
        },
        msg: function(name) {
            return this.i18n.msg(name).plain();
        }
    };
    mw.hook('dev.i18n').add($.proxy(Music.preload, Music));
    mw.hook('dev.ui').add($.proxy(Music.preload, Music));
})();
