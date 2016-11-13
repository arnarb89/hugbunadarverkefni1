'use strict';
var pg = require('pg');
var conString = process.env.DATABASE_URL;
//var Transaction = require('pg-transaction');


var dbc = {};


dbc.query = function(queryStr, parameters, then) {
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

/*dbc.waterfall = function (
		statementArray,
		inputVariablesArray,
		optionalSelectStatement,
		optionalSelectInputVariables,
		then){
	var theclient = new pg.Client(conString);
	console.log('111111111111');
	theclient.connect();
	var tx = new Transaction(theclient);
	var die = function(err){
		if (err) {
		  	tx.rollback('savepoint1');
		  	then(err,null);
		}
	};
	tx.on('error', die);
	console.log('22222222222222');

	tx.begin();
	tx.savepoint('savepoint1');
	for(var i = 0; i<statementArray.length;i++){
		tx.query(statementArray[i], inputVariablesArray[i]);
	}
	tx.commit();
	console.log('333333333333333');

	if(optionalSelectStatement){
		theclient.query(
			optionalSelectStatement, 
			optionalSelectInputVariables, 
			function(err, result){
				if (err) then(err,null);
				else{
					then(null,result);
				}
				//console.log(result.rows[0].count); // 1 
				  
			});
	};
	
	theclient.end();
	console.log('444444444444444');


};*/



module.exports = dbc;
