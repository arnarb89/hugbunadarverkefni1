'use strict';

var DBC = require('../cs-DBcontroller/cs-DBcontroller.js');

var userManager = {};

userManager.createFbUser = function (fbId, token, fullname, email , callback) {
	var inputVariables1 = [fullname, email];
	var inputVariables2 = [fbId, token,email];
	var inputVariables3 = [email];
	var sqlString1 = 'INSERT INTO "CheatSheet"."users" (fullname,email) VALUES ($1, $2);';
	var sqlString2 = 'INSERT INTO "CheatSheet"."userfb" (facebookid,token,userid) VALUES ($1, $2,(SELECT id FROM "CheatSheet"."users" WHERE email = $3));';
	var sqlString3 = 'SELECT * FROM "CheatSheet"."users" '+
	'LEFT JOIN "CheatSheet"."userlocal" '+
		'ON "CheatSheet"."users".id="CheatSheet"."userlocal".userid '+
	'LEFT JOIN "CheatSheet"."userfb" '+
		'ON "CheatSheet"."users".id="CheatSheet"."userfb".userid '+
	'WHERE email = $1;';

	var statementArray = [sqlString1,sqlString2,sqlString3];
	var inputVariablesArray = [inputVariables1,inputVariables2,inputVariables3];

	DBC.waterfallWithThreeStatements(statementArray, inputVariablesArray, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};

userManager.createLocalUser = function (username, password, email, fullname , callback) {
	var inputVariables1 = [fullname,email];
	var inputVariables2 = [password,username,email];
	var inputVariables3 = [username];
	var sqlString1 = 'INSERT INTO "CheatSheet"."users" (fullname,email) VALUES ($1, $2);';
	var sqlString2 = 'INSERT INTO "CheatSheet"."userlocal" (passwordhash,username,userid) VALUES ($1, $2,(SELECT id FROM "CheatSheet"."users" WHERE email = $3));';
	var sqlString3 = 'SELECT * FROM "CheatSheet"."users" '+
	'LEFT JOIN "CheatSheet"."userlocal" '+
		'ON "CheatSheet"."users".id="CheatSheet"."userlocal".userid '+
	'LEFT JOIN "CheatSheet"."userfb" '+
		'ON "CheatSheet"."users".id="CheatSheet"."userfb".userid '+
	'WHERE username = $1;';

	DBC.waterfallWithThreeStatements([sqlString1,sqlString2,sqlString3], [inputVariables1,inputVariables2,inputVariables3], function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};

userManager.updateProfileInformation = function (fullname, email, id, callback) {
	var inputVariables1 = [fullname,email, id];
	var sqlString1 = 'UPDATE "CheatSheet"."users" SET fullname=$1, email=$2 WHERE id=$3;';

	DBC.query(sqlString1, inputVariables1, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};

userManager.updatePasswordInformation = function (password, id, callback) {
	var inputVariables1 = [password, id];
	var sqlString1 = 'UPDATE "CheatSheet"."userlocal" SET passwordhash=$1 WHERE userid=$2;';

	DBC.query(sqlString1, inputVariables1, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};

userManager.updateUsernameInformation = function (username, id, callback) {
	var inputVariables1 = [username, id];
	var sqlString1 = 'UPDATE "CheatSheet"."userlocal" SET username=$1 WHERE userid=$2;';

	DBC.query(sqlString1, inputVariables1, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};



userManager.getUserByFbId = function (fbId, callback) {
	var sqlString = 'SELECT * FROM "CheatSheet"."users" '+
	'LEFT JOIN "CheatSheet"."userlocal" '+
		'ON "CheatSheet"."users".id="CheatSheet"."userlocal".userid '+
	'LEFT JOIN "CheatSheet"."userfb" '+
		'ON "CheatSheet"."users".id="CheatSheet"."userfb".userid '+
	'WHERE facebookid = $1;';
	var inputVariables = [fbId];

	DBC.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};

userManager.getLocalUserByUsername = function (username, callback) {
	var sqlString = 'SELECT * FROM "CheatSheet"."users" '+
	'LEFT JOIN "CheatSheet"."userlocal" '+
		'ON "CheatSheet"."users".id="CheatSheet"."userlocal".userid '+
	'LEFT JOIN "CheatSheet"."userfb" '+
		'ON "CheatSheet"."users".id="CheatSheet"."userfb".userid '+
	'WHERE username = $1;';
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
	var sqlString = 'SELECT * FROM "CheatSheet"."users" '+
	'LEFT JOIN "CheatSheet"."userlocal" '+
		'ON "CheatSheet"."users".id="CheatSheet"."userlocal".userid '+
	'LEFT JOIN "CheatSheet"."userfb" '+
		'ON "CheatSheet"."users".id="CheatSheet"."userfb".userid '+
	'WHERE id = $1;';
	var inputVariables = [userId];

	DBC.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};

module.exports = userManager;