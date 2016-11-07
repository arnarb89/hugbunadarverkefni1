'use strict';

var DBC = require('../cs-DBcontroller/cs-DBcontroller.js');

var userManager = {};

userManager.createUser = function (username, password, email, fullname , callback) {
	var sqlString = 'INSERT INTO "CheatSheet"."user" (username, password,email,fullname) VALUES ($1, $2, $3, $4)';
	var inputVariables = [username,password,email,fullname];

	DBC.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};

userManager.getUserByUsername = function (username, callback) {
	var sqlString = 'SELECT * FROM "CheatSheet"."user" WHERE username=$1';
	var inputVariables = [username];

	DBC.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};

userManager.getUserById = function (userId, callback) {
	var sqlString = 'SELECT id,username,password,email,fullname FROM "CheatSheet"."user" WHERE id=$1';
	var inputVariables = [userId];

	DBC.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
},

/*userManager.getUserByNameAndPassword = function (name, hashedPassword, callback) {
	var sqlString = "";
	var inputVariables = [];

	DBC.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};*/

module.exports = userManager;