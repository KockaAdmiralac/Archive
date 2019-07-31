var arr = $('.gallerybox img').toArray(), interval = setInterval(function() {
    if (arr.length === 0) {
        return;
    }
    var $img = $(arr.shift()),
        a = document.createElement('a');
    a.href = $img.attr('src');
    a.download = $img.attr('alt');
    document.body.appendChild(a);
    a.click();
}, 3000);
