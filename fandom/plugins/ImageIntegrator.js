(function() {
    'use strict';
    var ImageIntegrator = {
        providers: {
            imgur: /^http:\/\/i\.imgur\.com\/[a-zA-Z0-9]{7,8}\.(?:png|jpg|gif|webm)$/,
            gyazo: /^https:\/\/i\.gyazo\.com\/[a-z0-9]{32}\.png$/,
            gyazoFix: /^https:\/\/gyazo\.com\/([a-f0-9]{32})$/,
            prntsc1: /^http:\/\/prnt\.sc\/([a-z0-9]{6})(?:\/direct)?$/,
            prntsc2: /^http:\/\/image\.prntscr\.com\/image\/[a-f0-9]{32}\.png$/,
            vignette: /^https:\/\/vignette(?:1|2|3|4)\.wikia\.nocookie\.net\/[a-z0-9]+\/images\/[a-f0-9]\/[a-f0-9]{2}\/[^\/#]+\.(png|jpg|gif|jpeg|ico|bmp)(?:\/revision\/(?:latest|\d{14})(?:\/scale-to-width-down\/\d{1,9})?)?(?:\?cb=\d{14})?$/,
            wikimedia: /^https:\/\/upload\.wikimedia\.org\/.*$/, // TODO: Validate this
            wikia: /^http:\/\/([a-z0-9-]+)\.wikia\.com\/(?:wiki\/)?File:([^\/\?#]+)\.(png|jpg|gif|jpeg|ico|bmp)$/
        },
        init: function() {
            $('.ImageIntegrator').each($.proxy(this.replaceEl, this));
        },
        replaceEl: function(_, el) {
            var $el = $(el),
                data = $el.data();
            if(data.url) {
                var url = this.verifyURL(data.url);
                $el.html(
                    url ?
                        $('<img>', {
                            src: url,
                            alt: data.alt,
                            width: data.width,
                            height: data.height
                        }) :
                        'Image provider or URL format invalid!'
                );
            } else {
                $el.html('No image URL provided!');
            }
        },
        verifyURL: function(url) {
            for(var i in this.providers) {
                var res = this.providers[i].exec(url);
                if(res) {
                    var method = this[
                        'provide' +
                        i[0].toUpperCase() +
                        i.substring(1)
                    ];
                    if(method) {
                        return method(res);
                    } else {
                        return res[0];
                    }
                }
            }
        },
        provideGyazoFix: function(res) {
            return 'https://i.gyazo.com/' + res[1] + '.png';
        },
        providePrntsc1: function(res) {
            return 'http://prnt.sc/' + res[1] + '/direct';
        },
        provideWikia: function(res) {
            return 'http://' + res[1] + '.wikia.com/wiki/Special:FilePath/' + res[2] + '.' + res[3];
        }
    };
    ImageIntegrator.init();
})();
