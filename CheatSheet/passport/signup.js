var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var userManager = require('../cs-managers/userManager.js');

module.exports = function(passport){
    'use strict';

	passport.use('signup', new LocalStrategy(
        {
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req,username,password,done) {
            
            var findOrCreateUser = function(){
               userManager.getLocalUserByUsername(req.body.username, function(err, result) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (result.rows.length!==0) {
                        console.log('User already exists with username: '+req.body.username);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        // save the user
                        userManager.createLocalUser(
                            req.body.username,
                            createHash(req.body.password),
                            req.body.email,req.body.fullname,
                            function(err,result) {
                                if (err){
                                    console.log('Error in Saving user: '+err);  
                                    throw err;  
                                }
                                var theresults = result.rows[0];
                                if(theresults.passwordhash) {
                                    delete theresults.passwordhash;
                                }
                                return done(null, theresults);
                            }
                        );
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};