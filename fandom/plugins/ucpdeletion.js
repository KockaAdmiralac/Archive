var arr = [];
$('.wikitable tr:has(td)').each(function(_, el) {
    var $tr = $(el);
    if ($tr.find('td:nth-of-type(2)').text().trim() === 'Delete') {
        arr.push($tr.find('td:nth-of-type(1)').text().trim());
    }
});
var code = [];
function getCode() {
    var page = arr.shift();
    if (!page) {
        console.log('Done');
        return;
    }
    $.get(mw.util.getUrl(page, {action: 'render'}), function(d) {
        var pages = $(d).find('[data-source="Code"] a').map(function(_, el) {
            return decodeURIComponent($(el).attr('href').replace('https://dev.fandom.com/wiki/', ''));
        }).toArray();
        if (pages.length === 0) {
            console.error('No code on', page);
        }
        code.push(...pages);
    });
    setTimeout(getCode, 0);
}
getCode();
