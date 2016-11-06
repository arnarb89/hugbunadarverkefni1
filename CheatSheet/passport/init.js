var login = require('./login');
var signup = require('./signup');
//var User = require('../models/user');
var userManager = require('../cs-managers/userManager.js');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');
        console.log(user);
        done(null, user._id);
    });

    /*passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:',user);
            done(err, user);
        });
    });*/

    passport.deserializeUser(function(id, done) {
        userManager.getUserById(id, function(err, result) {
            console.log('deserializing user:',user);
            var theUser = {
                username : result.username,
                fullname: result.fullname,
                email: result.email
            };
            done(err, theUser);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}