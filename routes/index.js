var c = require('../lib/common.js');

exports.index = function(req, res){
	res.render('index', { 
		title: 'Index'
	});
};