var collected = [], cache = [];
setInterval(function() {
    $.get('/index.php', {
        action: 'ajax',
        rs: 'ChatAjax',
        method: 'getPrivateBlocks'
    }, function(d) {
		var c = 'bbcu:' + d.blockedByChatUsers.join('|') + 'bcu:' + d.blockedChatUsers.join('|');
		if (cache.indexOf(c) === -1) {
			cache.push(c);
			console.log('Found new dude:', d);
			collected.push(d);
        }
    });
}, 10000);