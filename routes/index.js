var c = require('../lib/common.js');

var offset;

exports.index = function(req, res){
	offset = 0;
	c.request('https://api.leaguevine.com/v1/tournaments/?offset='+offset+'&access_token=121ff44f02', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
			console.log('Succeeded: Index tournament request');
		}else{
			console.log(error);
		}

		res.render('index', { 
			title: 'Index',
			data: body
		});

	});	
};

exports.next = function(req, res){
	offset = offset + 20;
	console.log(offset);
	c.request('https://api.leaguevine.com/v1/tournaments/?offset='+offset+'&access_token=121ff44f02', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
			console.log('Succeeded: Index tournament request');
		}else{
			console.log(error);
		}

		res.render('index', { 
			title: 'Index',
			data: body
		});

	});	
};

exports.prev = function(req, res){
	if(offset > 0){
		offset = offset - 20;
	}
	c.request('https://api.leaguevine.com/v1/tournaments/?offset='+offset+'&access_token=121ff44f02', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
			console.log('Succeeded: Index tournament request');
		}else{
			console.log(error);
		}

		res.render('index', { 
			title: 'Index',
			data: body
		});

	});	
};




