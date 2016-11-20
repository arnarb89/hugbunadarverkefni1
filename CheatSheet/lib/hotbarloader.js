'use strict';

var dbc = require('../cs-DBcontroller/cs-DBcontroller.js');



module.exports = function (req,res, next) {
	if(!req.user){
		return next();
	}
	var sqlString = 'SELECT * FROM "CheatSheet"."hotbarelements" WHERE userid=$1;';
	var inputVariables = [req.user.id];

	dbc.query(sqlString, inputVariables, function(err, result) {
		res.locals.hotbarelements = {};
			res.locals.hotbarelements.courses = [];
			res.locals.hotbarelements.majors = [];
			res.locals.hotbarelements.summaries = [];
		if(err) {
			console.log("hotbarloader, err: "+err);
			return next();
		} else {
			if(result){
				for(var element in result){
					if(element.type=="course"){
						res.locals.hotbarelements.courses.push(element);
					}
					if(element.type=="major"){
						res.locals.hotbarelements.majors.push(element);
					}
					if(element.type=="summary"){
						res.locals.hotbarelements.summaries.push(element);
					}
				}
			}
			return next();
		}
	});
};