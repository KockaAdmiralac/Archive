// <nowiki>
$(function() {
    if(typeof mw.config.get('wgPageName') !== 'string' || mw.config.get('wgPageName').toLowerCase() !== 'special:blankpage/blogs') {
        return;
    }
    var ManageCCBlogs = {
        config: $.extend({
            template: "User:AdorableDarling/Blog message",
            data: {
                b: 'Blank blog',
                o: 'One line blog',
                l: 'Language blog',
                e: 'Off-topic essay',
                n: 'Non-blog blog'
            }
        }, window.ManageCCBlogsConfig),
        init: function() {
            this.api = new mw.Api();
            this.parameters = [];
            this.insertUI();
        },
        insertUI: function() {
            $('#mw-content-text').html('\
                <div id="ManageCCBlogsMain">                                            \
                    <fieldset class="collapsible">                                      \
                        <legend>Options</legend>                                        \
                        <form>                                                          \
                            <select id="ManageCCBlogsSelect">                           \
                                <option>Blank blog</option>                             \
                                <option>One line blog</option>                          \
                                <option>Language blog</option>                          \
                                <option>Off-topic essay</option>                        \
                                <option>Non-blog blog</option>                          \
                                <option>Patrol</option>                                 \
                            </select>                                                   \
                            <button id="ManageCCBlogsExecute">Execute</button>          \
                            <ul id="ManageCCBlogsAddParams"></ul>                       \
                            <input type="text" id="ManageCCBlogsParamsInput"></input>   \
                            <button id="ManageCCBlogsClearParams">Clear</button>        \
                        </form>                                                         \
                        <form>                                                          \
                            <button id="ManageCCBlogsRefresh">Refresh</button>          \
                        </form>                                                         \
                    </fieldset>                                                         \
                    <ul id="ManageCCBlogsList"></ul>                                    \
                </div>                                                                  \
            ');
            $('#ManageCCBlogsExecute').click($.proxy(this.execute, this));
            $('#ManageCCBlogsRefresh').click($.proxy(this.refresh, this));
            $('#ManageCCBlogsParamsInput').keydown($.proxy(this.inputParam, this));
            $('#ManageCCBlogsClearParams').click($.proxy(this.clearParams, this));
        },
        execute: function(e) {
            e.preventDefault();
            this.dataByUser = {};
            this.checked.forEach(function(el) {
                var data = this.data[el];
                this.dataByUser[data.user] = this.dataByUser[data.user] || [];
                this.dataByUser[data.user].push(data);
            }, this);
            $.each(this.dataByUser, $.proxy(this.executeUser, this));
        },
        executeUser: function(user, data) {
            switch($('#ManageCCBlogsSelect').prop('selectedIndex')) {
                case 0: // Blank blog
                    this.postMessage(user, 'b', function(user) {
                        data.forEach(function(el) {
                            this.deleteBlog(el.title, 'b');
                        }, this);
                    });
                    break;
                case 1: // One line blog
                    this.postMessage(user, 'o', function(user) {
                        data.forEach(function(el) {
                            this.deleteBlog(el.title, 'o');
                        }, this);
                    });
                    break;
                case 2: // Language blog
                    this.postMessage(user, 'l', function(user) {
                        data.forEach(function(el) {
                            this.deleteBlog(el.title, 'l');
                        }, this);
                    });
                    break;
                case 3: // Off-topic essay
                    if(data[1]) {
                        this.parameters.unshift(this.getBlogName(data[1].title));
                    }
                    this.parameters.unshift(this.getBlogName(data[0].title));
                    this.parameters.unshift(user);
                    this.postMessage(user, 'e', function(user) {
                        data.forEach(function(el) {
                            this.moveBlog(el.title, 'e');
                            this.patrolBlog(el.rcid);
                        }, this);
                    });
                    break;
                case 4: // Non-blog blog
                    if(data[1]) {
                        this.parameters.unshift(this.getBlogName(data[1].title));
                    }
                    this.parameters.unshift(this.getBlogName(data[0].title));
                    this.parameters.unshift(user);
                    this.postMessage(user, 'n', function(user) {
                        data.forEach(function(el) {
                            this.moveBlog(el.title, 'e');
                            this.patrolBlog(el.rcid);
                        }, this);
                    });
                    break;
                case 5: // Patrol
                    data.forEach(function(el) {
                        this.patrolBlog(el.rcid);
                    }, this);
                    break;
                default: // Idk
                    console.log("u wot m8");
            }
        },
        getBlogName: function(s) {
            return s.substring(s.indexOf('/') + 1);
        },
        refresh: function(e) {
            e.preventDefault();
            $('#ManageCCBlogsList').html('');
            this.data = {};
            this.checked = [];
            this.api.get({
                action: 'query',
                list: 'recentchanges',
                rcnamespace: 500,
                rclimit: 500,
                rcprop: 'title|user|ids|timestamp',
                rctype: 'new',
                rcshow: '!patrolled',
                rctoken: 'patrol'
            }).done($.proxy(function(d) {
                if(d.error) {
                    this.errorRefresh(d.error.code);
                } else {
                    var arr = d.query.recentchanges,
                        temp = [];
                    if(arr.length === 0) {
                        return;
                    }
                    this.token = arr[0].patroltoken;
                    arr.forEach(function(el) {
                        this.data[el.pageid] = {
                            rcid: el.rcid,
                            title: el.title,
                            user: el.user,
                            time: new Date(el.timestamp)
                        };
                    }, this);
                    this.fetchedPages = arr.map(function(el) { return el.title; });
                    this.fetchNextPack();
                }
            }, this)).fail(this.errorRefresh);
        },
        fetchNextPack: function() {
            if(this.fetchedPages.length === 0) {
                for(var key in this.data) {
                    if(this.data.hasOwnProperty(key)) {
                        this.render(this.data[key], key);
                    }
                }
                this.afterRender();
            } else {
                this.fetchInfo(this.fetchedPages.splice(0, 50));
            }
        },
        fetchInfo: function(pack) {
            this.api.get({
                action: 'query',
                prop: 'revisions',
                titles: pack.join('|'),
                rvprop: 'content|size',
                rvparse: 1
            }).done($.proxy(function(d) {
                if(d.error) {
                    this.errorFetch(d.error.code);
                } else {
                    var obj = d.query.pages;
                    for(var key in obj) {
                        if(obj.hasOwnProperty(key) && typeof obj[key].missing !== 'string') {
                            var data = obj[key].revisions[0];
                            this.data[key] = $.extend({
                                size: data.size,
                                content: data['*']
                            }, this.data[key]);
                        }
                    }
                    this.fetchNextPack();
                }
            }, this)).fail($.proxy(this.errorFetch, this));
        },
        render: function(data, id) {
            $('#ManageCCBlogsList').prepend(
                $('<li></li>')
                    .attr({
                        class: 'ManageCCBlogsListItem',
                        'data-id': id
                    })
                    .append(
                        $('<input></input>')
                            .attr({
                                class: 'ManageCCBlogsListItemCheckbox',
                                type: 'checkbox'
                            })
                    )
                    .append(
                        $('<span></span>')
                            .attr('class', 'ManageCCBlogsListItemTime')
                            .text(
                                '[' + data.time.getFullYear() +
                                '/' + data.time.getMonth() +
                                '/' + data.time.getDate() +
                                ' ' + data.time.getHours() +
                                ':' + data.time.getMinutes() +
                                ':' + data.time.getSeconds() +
                                '] '
                            )
                    )
                    .append(
                        $('<a></a>')
                            .attr({
                                class: 'ManageCCBlogsListItemLink',
                                href: mw.config.get('wgServer') + '/wiki/' + encodeURIComponent(data.title)
                            })
                            .text(data.title.substring(10))
                    )
                    .append(' [' + data.size + 'B] [')
                    .append(
                        $('<a></a>')
                            .attr('class', 'ManageCCBlogsListItemPreview')
                            .text('preview')
                    )
                    .append(']')
            );
        },
        afterRender: function() {
            $('.ManageCCBlogsListItemPreview').click($.proxy(this.previewClick, this));
            $('.ManageCCBlogsListItemCheckbox').click($.proxy(this.checkboxClick, this));
        },
        previewClick: function(e) {
            $.showCustomModal('Preview', this.data[$(e.target.parentNode).data().id].content, {
                width: 1000,
                id: 'ManageCCBlogsPreviewModal'
            });
        },
        checkboxClick: function(e) {
            var id = $(e.target.parentNode).data().id,
                index = this.checked.indexOf(id);
            if(e.target.checked && index === -1) {
                this.checked.push(id);
            } else {
                this.checked.splice(index, 1);
            }
        },
        inputParam: function(e) {
            if(e.keyCode === 13) {
                e.preventDefault();
                var val = $(e.target).val();
                $('#ManageCCBlogsAddParams').append(
                    $('<li></li>')
                        .attr('class', 'ManageCCBlogsAddParamsListItem')
                        .text(val)
                );
                this.parameters.push(val);
            }
        },
        clearParams: function(e) {
            e.preventDefault();
            this.parameters = [];
            $('#ManageCCBlogsAddParams').html('');
        },
        postMessage: function(user, action, callback) {
            var multiple = (this.dataByUser[user].length > 1),
                params = [(multiple ? '+' : '-'), action].concat(this.parameters);
            $.nirvana.sendRequest({
                controller: 'WallExternalController',
                method: 'postNewMessage',
                type: 'POST',
                data: {
                    body: '{{' + this.config.template + '|' + params.join('|') + '}}<span style="display:none">sent to ' + user + '</span>',
                    messagetitle: this.config.data[action] + (multiple ? 's' : ''),
                    pagetitle: user,
                    pagenamespace: 1200,
                    token: mw.user.tokens.get('editToken')
                }
            }).done($.proxy(function(data) {
                if(data.status) {
                    if(typeof callback === 'function') {
                        callback.call(this, user);
                    }
                } else {
                    this.errorPost();
                }
            }, this)).fail(this.errorPost);
        },
        errorPost: function() {
            new BannerNotification('An error occurred while post on user\'s Message Wall', 'error').show();
        },
        errorDelete: function(code) {
            new BannerNotification('An error occurred while deleting the blog post: ' + (typeof code === 'string' ? code : 'ajax'), 'error').show();
        },
        errorFetch: function(code) {
            new BannerNotification('An error occurred while fetching information about blog posts: ' + (typeof code === 'string' ? code : 'ajax'), 'error').show();
            this.fetchNextPack();
        },
        errorMove: function(code) {
            new BannerNotification('An error occurred while deleting the blog post: ' + (typeof code === 'string' ? code : 'ajax'), 'error').show();
        },
        errorPatrol: function(code) {
            new BannerNotification('An error occurred while patrolling the blog post: ' + (typeof code === 'string' ? code : 'ajax'), 'error').show();
        },
        deleteBlog: function(blog, action) {
            this.api.post({
                action: 'delete',
                title: blog,
                reason: this.config.data[action],
                token: mw.user.tokens.get('editToken'),
                bot: true
            }).done($.proxy(function(d) {
                if(d.error) {
                    this.errorDelete(d.error.code);
                } else {
                    new BannerNotification('Successfully deleted ' + blog + '!', 'success').show();
                }
            }, this)).fail(this.errorDelete);
        },
        moveBlog: function(blog, action) {
            this.api.post({
                action: 'move',
                from: blog,
                to: 'User' + blog.substring(9),
                reason: this.config.data[action],
                noredirect: true,
                token: mw.user.tokens.get('editToken'),
                ignorewarnings: true
            }).done($.proxy(function(d) {
                if(d.error) {
                    this.errorMove(d.error.code);
                } else {
                    new BannerNotification('Successfully moved ' + blog + '!', 'success').show();
                }
            }, this)).fail(this.errorMove);
        },
        patrolBlog: function(rcid) {
            this.api.post({
                action: 'patrol',
                token: this.token,
                rcid: rcid
            }).done($.proxy(function(d) {
                if(d.error) {
                    this.errorPatrol(d.error.code);
                } else {
                    new BannerNotification('Patrolling successful!', 'success').show();
                }
            }, this)).fail(this.errorPatrol);
        }
    };
    mw.loader.using('mediawiki.api').then($.proxy(ManageCCBlogs.init, ManageCCBlogs));
});


