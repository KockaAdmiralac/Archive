var files = [];
$('.TablePager_col_img_timestamp').prepend(
	$('<input>', {
		type: 'checkbox',
		'class': 'filecheckbox'
    }).click(function() {
		var $this = $(this),
			image = $($(this).closest('tr').children()[1]).find('a').attr('title');
		if($this.prop('checked')) {
			files.push(image);
		} else {
			files.splice(files.indexOf(image), 1);
		}
	})
);
function clear() {
	$('.filecheckbox').prop('checked', false);
	files = [];
}

