'use strict';

var dbc = require('../cs-DBcontroller/cs-DBcontroller.js');


module.exports = function breadcrumbsloader(type,id) {
  	return function(req, res, next) {
  		var breadcrumbs = {};

    	if(type=="login"){

    	}else if(type=="signup"){

    	}else if(type=="account"){

    	}else if(type=="major"){

    		

    	}else if(type=="course"){

    	}else if(type=="summary"){

    	}else if(type=="summarycreation"){

    	}

    	res.locals.breadcrumbs = breadcrumbs;



    	next();
  	}
}


module.exports = function (req,res, next) {
	if(!req.user){
		return next();
	}
	var sqlString = 'SELECT DISTINCT * FROM "CheatSheet"."hotbarelements" WHERE userid=$1;';
	var inputVariables = [req.user.id];

	var breadcrumbs = {};

	dbc.query(sqlString, inputVariables, function(err, result) {
		res.locals.hotbarelements = {};
			res.locals.hotbarelements.courses = [];
			res.locals.hotbarelements.majors = [];
			res.locals.hotbarelements.summaries = [];
		if(err) {
			//console.log("hotbarloader, err: "+err);
			return next();
		} else {
			if(result){
				//console.log("hotbarloader, result: "+JSON.stringify(result.rows));
				for(var element in result.rows){
					//console.log("element in result.rows: "+JSON.stringify(element));
					if(result.rows[element].type=="course"){
						res.locals.hotbarelements.courses.push(result.rows[element]);
					}
					if(result.rows[element].type=="major"){
						res.locals.hotbarelements.majors.push(result.rows[element]);
					}
					if(result.rows[element].type=="summary"){
						res.locals.hotbarelements.summaries.push(result.rows[element]);
					}
				}
			}
			//console.log("res.locals.hotbarelements: "+JSON.stringify(res.locals.hotbarelements));
			return next();
		}
	});
};