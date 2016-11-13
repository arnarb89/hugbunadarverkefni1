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

	DBC.query(sqlString1, inputVariables1, function(err, result) {
		console.log("In first query, input Variables are: "+JSON.stringify(inputVariables1));
		if(err) {
			return callback(err);
		} else {
			DBC.query(sqlString2, inputVariables2, function(err, result) {
				console.log("In second query, input Variables are: "+JSON.stringify(inputVariables2));
				if(err) {
					return callback(err);
				} else {
					DBC.query(sqlString3, inputVariables3, function(err, result) {
						console.log("In third query, input Variables are: "+JSON.stringify(inputVariables3));
						if(err) {
							return callback(err);
						} else {
							return callback(null, result);
						};
					});
				};
			});
		};
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

	DBC.query(sqlString1, inputVariables1, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			DBC.query(sqlString2, inputVariables2, function(err, result) {
				if(err) {
					return callback(err);
				} else {
					DBC.query(sqlString3, inputVariables3, function(err, result) {
						if(err) {
							return callback(err);
						} else {
							return callback(null, result);
						};
					});
				};
			});
		};
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