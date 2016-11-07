var login = require('./login');
var signup = require('./signup');
//var User = require('../models/user');
var userManager = require('../cs-managers/userManager.js');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: '+JSON.stringify(user));
        //done(null, user.id);
        var theUser = {};
        theUser.username = user.username;
        theUser.fullname = user.fullname;
        theUser.id = user.id;
        done(null, theUser);
    });


    passport.deserializeUser(function(user, done) {
        console.log('Deserializing, id is: '+JSON.stringify(user.id));
        console.log('Deserializing, id is: '+JSON.stringify(user));
        userManager.getUserById(user.id, function(err, result) {
            console.log('Deserializing, result.rows is: '+JSON.stringify(result.rows[0]));
            if(!err) done(null,result.rows[0]);
            else done(err,null);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}