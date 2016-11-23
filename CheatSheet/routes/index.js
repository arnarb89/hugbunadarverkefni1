var express = require('express');
var router = express.Router();


module.exports = function(passport){

	

	/* open root page */
  	router.get('/', function(req, res, next) {
	  	res.render('placeholder-index', { title: 'Express', schools:[ {schoolId:1, schoolName:'Haskoli Islands'}]});
	});


	return router;
}