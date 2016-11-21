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


module.exports = accountManager;