'use strict';

var dbc = require('../../cs-DBcontroller/cs-DBcontroller.js');



var accountManager = {};


accountManager.removeHotbarElement = function (userid,type,elementid, callback) {

	var sqlString = 'DELETE FROM "CheatSheet"."hotbarelements" WHERE userid=$1 and type=$2 and elementid=$3;';
	var inputVariables = [userid,type,elementid];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};

accountManager.addHotbarElement = function (userid,type,contentid,contentname, callback) {

	var sqlString = 'INSERT INTO "CheatSheet"."hotbarelements" (userid,type,elementid,contentname) SELECT $1,$2,$3,$4 FROM "CheatSheet"."hotbarelements" '+
	'WHERE NOT EXISTS (SELECT * FROM "CheatSheet"."hotbarelements" WHERE userid=$1 AND type=$2 AND elementid=$3 AND contentname=$4);';
	
	var sqlString = 'INSERT INTO "CheatSheet"."hotbarelements" (userid,type,elementid,contentname) VALUES ($1,$2,$3,$4);';
	var inputVariables = [userid,type,contentid,contentname];

	/*insert into company (unique_id, company_name)
	select 42, 'New Company Name'
	from company
	where not exists (select 1 from company where unique_id = 42);*/

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};


module.exports = accountManager;