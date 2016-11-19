'use strict';
var pg = require('pg');
var conString = process.env.DATABASE_URL;


var dbc = {};


dbc.query = function(queryStr, parameters, then) {
	queryStr = addSearchPath(queryStr);

	pg.connect(conString, function(err, client, done) {
		if(err) {
		  	return console.error('error fetching client from pool', err);
		}
		client.query(queryStr, parameters, function(err, result) {
		  	//call `done()` to release the client back to the pool
		  	done();
		  	if(err) {
				return then(err, null);
		  	}
		  	then(null, result);
		});
	});
};

dbc.waterfallWithThreeStatements = function(statementArray,inputVariablesArray,then){
	statementArray = statementArray.map(addSearchPath);

	var Client = require('pg').Client;
	var client = new Client(conString);
	client.connect();
	client.query('BEGIN', function(err, result) {
	  	if(err) {
	  		return then(err, null);
	  	}
	  	client.query(statementArray[0], inputVariablesArray[0], function(err, result) {
	    	if(err) {
	    		return then(err, null);
	    	}
	    	client.query(statementArray[1], inputVariablesArray[1], function(err, result) {
	      		if(err){ 
	      			return then(err, null);
	      		}
	      		client.query(statementArray[2], inputVariablesArray[2], function(err, result) {
		      		if(err){ 
		      			return then(err, null);
		      		}
		      		//disconnect after successful commit
		      		client.query('COMMIT', client.end.bind(client));
		      		return then(null,result);
		    	});
	    	});
	  	});
	});
};


function addSearchPath(queryStr) {
	var search_path = 'SET search_path TO "CheatSheet";'
	return search_path+queryStr;
};

module.exports = dbc;
