var login = require('./login');
var signup = require('./signup');
var userManager = require('../cs-managers/userManager.js');
var facebook = require('./facebook');

module.exports = function(passport){
    'use strict';

	// Serialization determines what should be stored in the cookie, gets "user" from done() of i.e. passport/login.js and passport/signup.js
    passport.serializeUser(function(user, done) {
        if(user.passwordhash) {
            delete user.passwordhash;
        }
        done(null, user);
    });

    // Deserialization fetches "user" from the cookie and puts into session (i think?)
    passport.deserializeUser(function(user, done) {
        userManager.getUserById(user.id, function(err, result) {
            var theresult = result.rows[0];
            if(theresult.passwordhash) {
                delete theresult.passwordhash;
            }
            if(!err) {
                done(null,theresult);
            }
            else {
                done(err,null);
            }
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);
    facebook(passport);

};