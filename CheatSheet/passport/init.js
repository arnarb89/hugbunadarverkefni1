var login = require('./login');
var signup = require('./signup');
//var User = require('../models/user');
var userManager = require('../cs-managers/userManager.js');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: '+JSON.stringify(user));
        done(null, user.id);
    });

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    /*passport.serializeUser(function(user, done) {
        userManager.getUserByUsername(user.username, function(err, result) {
            //result.rows.id = id;
            console.log('serializing user:',result.rows);
            var userObject = {
                username: result.rows.username,
                id: result.rows.id,
                email: result.rows.email,
                fullname: result.rows.fullname
            };
            var userId = {
                id: result.rows.id
            }
            done(null, userObject);
        });
    });*/

    /*passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:',user);
            done(err, user);
        });
    });*/

    passport.deserializeUser(function(id, done) {
        console.log('Deserializing, id is: '+JSON.stringify(id));
        userManager.getUserById(id, function(err, result) {
            console.log('Deserializing, result.rows is: '+JSON.stringify(result.rows[0]));
            if(!err) done(null,result.rows[0]);
            else done(err,null);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}