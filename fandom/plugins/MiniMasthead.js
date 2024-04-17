(function() {
    'use strict';
    var config = mw.config.get([
        'wgUserLanguage'
    ]), username = $('#UserProfileMasthead .masthead-info h1').text();
    if (!username) {
        return;
    }
    var MiniMasthead = {
        usprop: [
            'blockinfo',
            'groups',
            'implicitgroups',
            'rights',
            'editcount',
            'registration',
            'emailable',
            'gender'
        ],
        messages: [
            'editcount',
            'yourgender',
            'userrights-groupsmember',
            'tags-title',
            'lookupuser-registration',
            'communitypage-joined',
            'abtesting-heading-id',
            'yourrealname',
            'user-identity-box-zero-state-birthday',
            'user-identity-box-zero-state-occupation',
            'user-identity-box-zero-state-location',
            'user-identity-box-zero-state-gender',
            'user-identity-box-zero-state-fb-page',
            'user-identity-box-zero-state-twitter',
            'user-identity-box-zero-state-website',
            'user-identity-bio-modal-title',
            'user-identity-box-discussion-posts',
            'january',
            'february',
            'march',
            'april',
            'may',
            'june',
            'july',
            'august',
            'september',
            'october',
            'november',
            'december'
        ],
        convert: {
            avatar: {
                convert: function(value) {
                    return {
                        type: 'img',
                        classes: ['MiniMastheadGroup'],
                        attr: {
                            src: value,
                            width: 150,
                            height: 150
                        }
                    };
                }
            },
            edits: {
                msg: 'editcount'
            },
            sex: {
                msg: 'yourgender'
            },
            gender: {
                msg: 'user-identity-box-zero-state-gender'
            },
            groups: {
                msg: 'userrights-groupsmember'
            },
            tags: {
                msg: 'tags-title'
            },
            registration: {
                msg: 'lookupuser-registration'
            },
            firstEdit: {
                msg: 'communitypage-joined'
            },
            id: {
                msg: 'abtesting-heading-id'
            },
            realname: {
                msg: 'yourrealname'
            },
            occupation: {
                msg: 'user-identity-box-zero-state-occupation'
            },
            location: {
                msg: 'user-identity-box-zero-state-location'
            },
            wikisHidden: {
                text: 'Wikis hidden'
            },
            website: {
                msg: 'user-identity-box-zero-state-website'
            },
            facebook: {
                msg: 'user-identity-box-zero-state-fb-page'
            },
            twitter: {
                msg: 'user-identity-box-zero-state-twitter'
            },
            birthday: {
                msg: 'user-identity-box-zero-state-birthday',
                convert: function(value) {
                    return [
                        'january',
                        'february',
                        'march',
                        'april',
                        'may',
                        'june',
                        'july',
                        'august',
                        'september',
                        'october',
                        'november',
                        'december'
                    ][value[0] - 1] + ' ' + value[1];
                }
            },
            bio: {
                msg: 'user-identity-bio-modal-title'
            },
            posts: {
                msg: 'user-identity-box-discussion-posts'
            },
            blocked: {
                convert: function() {
                    return {
                        type: 'div',
                        classes: ['MiniMastheadGroup'],
                        attr: { id: 'MiniMastheadBlock' },
                        children: this.data.blockedby ? [
                            'Blocked by ',
                            {
                                type: 'a',
                                attr: {
                                    href: mw.util.getUrl(
                                        'Special:Contribs/' +
                                        this.data.blockedby
                                    )
                                }
                            },
                            this.data.blockexpiry ?
                                ' until ' +
                                this.data.blockexpiry.toLocaleString() :
                                ' forever ',
                            '(',
                            {
                                type: 'span',
                                attr: { id: 'MiniMastheadBlockReason' },
                                text: this.data.blockreason
                            },
                            ')'
                        ] : 'Globally blocked'
                    };
                }
            }
        },
        init: function(ui) {
            this.api = new mw.Api();
            this.ui = ui;
            $.when(
                this.nirvana(),
                this.mediawiki()
            ).done($.proxy(this.cbInfo, this));
        },
        nirvana: function() {
            return $.nirvana.getJson(
                'UserProfilePage',
                'renderUserIdentityBox',
                {
                    title: 'User:' + username,
                    uselang: 'en'
                }
            );
        },
        mediawiki: function() {
            return this.api.get({
                action: 'query',
                list: 'users',
                ususers: username,
                usprop: this.usprop.join('|'),
                meta: 'allmessages',
                ammessages: this.messages.join('|'),
                amlang: config.wgUserLanguage
            });
        },
        cbInfo: function(nirvana, mediawiki) {
            mediawiki = mediawiki[0].query;
            this.msg = {};
            mediawiki.allmessages.forEach(function(m) {
                this.msg[m.name] = m['*'];
            }, this);
            nirvana = nirvana[0];
            var nUser = nirvana.user,
                mUser = mediawiki.users[0];
            this.data = {
                avatar: nUser.avatar,
                edits: mUser.editcount,
                sex: mUser.gender,
                groups: mUser.groups,
                tags: nUser.tags,
                registration: new Date(mUser.registration),
                firstEdit: new Date(nUser.registration),
                id: mUser.userid,
                realname: nUser.realName,
                occupation: nUser.occupation,
                location: nUser.location,
                wikisHidden: nUser.hideEditsWikis === '1',
                gender: nUser.gender,
                facebook: nUser.fbPage,
                twitter: nUser.twitter,
                website: nUser.website,
                birthday: [nUser.month, nUser.day],
                bio: nUser.bio,
                posts: nirvana.discussionActive ? nirvana.discussionPostsCount : null
            };
            if (nirvana.isBlocked) {
                this.data.blocked = true;
                this.data.blockedby = mUser.blockedby;
                this.data.blockreason = mUser.blockreason;
                if (mUser.blockexpiry === 'infinity') {
                    this.data.blockexpiry = -1;
                } else {
                    var d = mUser.blockexpiry
                        .match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
                    this.data.blockexpiry = new Date(
                        d[1], Number(d[2]) - 1, d[3], d[4], d[5], d[6]
                    );
                }
            }
            $.get(
                'https://services.wikia.com/user-attribute/user/' +
                mUser.userid, $.proxy(this.cbService, this)
            );
        },
        cbService: function(data) {
            data._embedded.properties.forEach(function(el) {
                if (!el.value) {
                    return;
                }
                switch (el.name) {
                    case 'avatar':
                    case 'website':
                    case 'bio':
                    case 'location':
                    case 'occupation':
                    case 'twitter':
                        this.data[el.name] = el.value;
                        break;
                    case 'fancysig':
                        this.data.fancysig = el.value === '1';
                        break;
                    case 'fbPage':
                        this.data.facebook = el.value;
                        break;
                    case 'name':
                        this.data.realname = el.value;
                        break;
                    case 'nickname':
                        this.data.signature = el.value;
                        break;
                    case 'social_instagram':
                    case 'social_twitch':
                    case 'social_youtube':
                        this.data[el.name.substring(7)] = el.value;
                        break;
                    case 'UserProfilePagesV3_birthday':
                        this.data.birthday = el.value.split('-');
                        break;
                    case 'UserProfilePagesV3_gender':
                        this.data.gender = el.value;
                        break;
                    case 'wordpressId':
                        this.wordpress = el.value;
                        break;
                    default:
                        break;
                }
            }, this);
            this.render();
        },
        render: function() {
            $(this.ui({
                type: 'div',
                attr: { id: 'MiniMasthead' },
                children: $.map(this.data, $.proxy(function(v, k) {
                    var d = this.convert[k];
                    if (!d || (d instanceof Array && !d.length)) {
                        return;
                    }
                    var result = (d.convert || this.defConvert).call(this, v);
                    return typeof result === 'object' ? result : {
                        type: 'div',
                        classes: ['MiniMastheadGroup', k],
                        children: [
                            {
                                type: 'div',
                                classes: ['MiniMastheadLabel'],
                                text: d.text || this.msg[d.msg]
                            },
                            {
                                type: 'div',
                                classes: ['MiniMastheadValue'],
                                children: [result]
                            }
                        ]
                    };
                }, this)),
                style: {
                    top: 0
                }
            })).appendTo('body').draggable({ containment: 'window' });
        },
        defConvert: function(value) {
            if (typeof value === 'string') {
                return value;
            } else if (typeof value === 'number') {
                return String(value);
            } else if (value instanceof Date) {
                return value.toLocaleString();
            } else if (value instanceof Array) {
                return value.join(', ');
            } else {
                return 'Invalid default value';
            }
        }
    };
    importArticle({
        type: 'script',
        article: 'u:dev:MediaWiki:UI-js/code.js'
    });
    mw.loader.using(['mediawiki.api', 'jquery.ui.draggable']).then(function() {
        mw.hook('dev.ui').add($.proxy(MiniMasthead.init, MiniMasthead));
    });
})();