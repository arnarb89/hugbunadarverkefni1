var FacebookStrategy = require('passport-facebook').Strategy;
var fbConfig = require('../social/fb.js');
var userManager = require('../cs-managers/userManager.js');
//var User = require('../models/user');
var CryptoJS = require('crypto-js');


module.exports = function(passport) {

	var appsecret_proof = CryptoJS.HmacSHA256(fbConfig.appID, fbConfig.appSecret);
    passport.use('facebook', new FacebookStrategy({
        clientID        : fbConfig.appID,
        clientSecret    : fbConfig.appSecret,
        callbackURL     : fbConfig.callbackUrl,
        profileFields: ['id','displayName', 'emails', 'name']
        //,appsecret_proof	: appsecret_proof
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {

    	console.log('profile', profile);

		// asynchronous
		process.nextTick(function() {

			// find the user in the database based on their facebook id
	        //User.findOne({ 'id' : profile.id }, function(err, user) {
	        userManager.getUserByFbId(profile.id, function(err, result) {

	        	// if there is an error, stop everything and return that
	        	// ie an error connecting to the database
	            if (err)
	                return done(err);

				// if the user is found, then log them in
	            if (result.rows.length!==0) {
	        		var theresult = result.rows[0];
	        		if(theresult.passwordhash) delete theresult.passwordhash;
	                return done(null, theresult); // user found, return that user
	            } else {
	                /*// if there is no user found with that facebook id, create them
	                var newUser = {};

					// set all of the facebook information in our user model
	                newUser.id    = "fb"+profile.id; // set the users facebook id	                
	                newUser.token = access_token; // we will save the token that facebook provides to the user	                
	                newUser.firstname  = profile.name.givenName;
	                newUser.lastname = profile.name.familyName; // look at the passport user profile to see how names are returned
	                newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
	                */
	                // save the user
	                console.log("profile.id is: "+profile.id);
                    userManager.createFbUser(
                    	profile.id,
                    	access_token,
                    	profile.displayName,
                    	profile.emails[0].value,
                        function(err,result) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            var theresult = result.rows[0];
                            if(theresult.passwordhash) delete theresult.passwordhash;
                            return done(null, theresult);
                            /*userManager.getUserByUsername(req.body.username, function(err, result) {
                                if (err){
                                    console.log('Error in getting user by username: '+err);  
                                    throw err;  
                                }
                                newUser.id = result.rows[0].id;
                                 return done(null, newUser);
                            });*/
                        }
                    );
                    /*
					// save our user to the database
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;

	                    // if successful, return the new user
	                    return done(null, newUser);
	                });*/
	            }

	        });
        });

    }));

};