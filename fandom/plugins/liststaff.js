var api = new mw.Api(), array = [], images = [], length = 0, images2 = [];
api.get({
	action: 'query',
	list: 'allusers',
	aulimit: 500,
	augroup: 'staff'
}).done(function(d) {
	var staff = d.query.allusers.map(el => el.name);
	length = staff.length;
	staff.forEach(function(el) {
		api.get({
			action: 'query',
			list: 'logevents',
			leaction: 'upload/upload',
			leuser: el,
			lelimit: 500,
			leend: '2016-08-01T00:00:00Z'
		}).done(function(d) {
			array = array.concat(d.query.logevents.map(el => el.title));
			if(--length === 0) {
				console.log('Fetching image information');
				while(array.length > 0) {
					var pack = array.splice(0, 50);
					api.get({
						action: 'query',
						prop: 'categories',
						titles: pack.join('|'),
						clcategories: 'Category:Staff Images|Category:Videos',
						cllimit: 500
					}).done(function(d) {
						console.log(d);
						$.each(d.query.pages, function(key, value) {
							if(key > 0 && !value.categories) {
								console.log(value);
								images.push(value.title);
							}
						});
					}).fail(function() {
						console.log('Timeout while fetching image info rip. WHAT NOW');
					});
				}
			}
		}).fail(function(e) {
			console.log(`Timeout on ${el}`);
		})
	});
});