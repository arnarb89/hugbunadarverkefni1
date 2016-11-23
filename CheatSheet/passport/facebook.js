var FacebookStrategy = require('passport-facebook').Strategy;
var fbConfig = require('../social/fb.js');
var userManager = require('../cs-managers/userManager.js');
//var CryptoJS = require('crypto-js');


module.exports = function(passport) {
	'use strict';

	//var appsecret_proof = CryptoJS.HmacSHA256(fbConfig.appID, fbConfig.appSecret);
    passport.use('facebook', new FacebookStrategy({
        clientID        : fbConfig.appID,
        clientSecret    : fbConfig.appSecret,
        callbackURL     : fbConfig.callbackUrl,
        profileFields: ['id','displayName', 'emails', 'name']
        //,appsecret_proof	: appsecret_proof
    },

    // facebook will send back the tokens and profile
    function(accessToken, refreshToken, profile, done) {

		// asynchronous
		process.nextTick(function() {

			// find the user in the database based on their facebook id
	        userManager.getUserByFbId(profile.id, function(err, result) {

	        	// if there is an error, stop everything and return that
	        	// ie an error connecting to the database
	            if (err){
	                return done(err);
	            }

				// if the user is found, then log them in
	            if (result.rows.length!==0) {
	        		var theresult = result.rows[0];
	        		if(theresult.passwordhash) {
	        			delete theresult.passwordhash;
	        		}
	                return done(null, theresult); // user found, return that user
	            } else {
	                 // save the user
                    userManager.createFbUser(
                    	profile.id,
                    	accessToken,
                    	profile.displayName,
                    	profile.emails[0].value,
                        function(err,result) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            var theresult = result.rows[0];
                            if(theresult.passwordhash) {
                            	delete theresult.passwordhash;
                            }
                            return done(null, theresult);
                        }
                    );
	            }

	        });
        });

    }));

};