'use strict';

var query = require('../DBController.js');



var accountManager = {};


accountManager.getAccountInfoByUser = function (user, callback) {
	var sqlString = "";
	var inputVariables = [];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}


// NO idea how this actually works. Needs to be changed to implement actual functionality.
accountManager.connectWithThirdPartyService = function (thirdPartyIdentifier, serviceName, callback) {
	var sqlString = "";
	var inputVariables = [];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}


module.exports = accountManager;