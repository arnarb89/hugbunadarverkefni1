'use strict';

var query = require('../DBController.js');



var userManager = {};


userManager.createUser = function (name, hashedPassword, callback) {
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

userManager.getUserById = function (userId, callback) {
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

userManager.getUserByNameAndPassword = function (name, hashedPassword, callback) {
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

module.exports = userManager;