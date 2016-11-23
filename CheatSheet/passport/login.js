var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var userManager = require('../cs-managers/userManager.js');

module.exports = function(passport){
    'use strict';

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            userManager.getLocalUserByUsername(username, function(err, result) {
                // In case of any error, return using the done method
                if (err){
                    return done(err);
                }
                // Username does not exist, log the error and redirect back
                if (result.rows.length===0){
                    console.log('User Not Found with username '+username);
                    return done(null, false, req.flash('message', 'There is no user with the username "'+username+'". Please try again.'));                 
                }
                // User exists but wrong password, log the error 
                if (!isValidPassword(result.rows[0], password)){
                    console.log('Invalid Password');
                    return done(null, false, req.flash('message', 'Invalid password. Please try again.')); // redirect back to login page
                }
                // User and password both match, return user from done method
                // which will be treated like success
                return done(null, result.rows[0]);
                
            });

        })
    );


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.passwordhash);
    };
    
};