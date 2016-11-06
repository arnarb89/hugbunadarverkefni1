var express = require('express');
var router = express.Router();


module.exports = function(passport){

	

	/* open root page */
  	router.get('/', function(req, res, next) {
	  	res.render('index', { title: 'Express' });
	});


	return router;
}