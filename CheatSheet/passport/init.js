var login = require('./login');
var signup = require('./signup');
//var User = require('../models/user');
var userManager = require('../cs-managers/userManager.js');
var facebook = require('./facebook');

module.exports = function(passport){

	// Serialization determines what should be stored in the cookie, gets "user" from done() of f.x. passport/login.js and passport/signup.js
    passport.serializeUser(function(user, done) {
        console.log('serializing user: '+JSON.stringify(user));
        //done(null, user.id);
        /*var theUser = {};
        theUser.username = user.username;
        theUser.fullname = user.fullname;
        theUser.id = user.id;*/
        if(user.passwordhash) delete user.passwordhash;
        done(null, user);
    });

    // Deserialization fetches "user" from the cookie and puts into session (i think?)
    passport.deserializeUser(function(user, done) {
        console.log('Deserializing, id is: '+JSON.stringify(user.id));
        console.log('Deserializing, id is: '+JSON.stringify(user));
        userManager.getUserById(user.id, function(err, result) {
            console.log('Deserializing, result.rows is: '+JSON.stringify(result.rows[0]));
            var theresult = result.rows[0];
            if(theresult.passwordhash) delete theresult.passwordhash;
            if(!err) done(null,theresult);
            else done(err,null);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);
    facebook(passport);

}