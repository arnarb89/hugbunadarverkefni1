var LocalStrategy   = require('passport-local').Strategy;
//var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var userManager = require('../cs-managers/userManager.js');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // check in mongo if a user with username exists or not
            //User.findOne({ 'username' :  username }, 
            userManager.getLocalUserByUsername(username, function(err, result) {
                //function(err, user) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);
                // Username does not exist, log the error and redirect back
                if (result.rows.length===0){
                    console.log('User Not Found with username '+username);
                    return done(null, false, req.flash('message', 'User Not found.'));                 
                }
                // User exists but wrong password, log the error 
                if (!isValidPassword(result.rows[0], password)){
                    console.log('Invalid Password');
                    return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                }
                // User and password both match, return user from done method
                // which will be treated like success
                return done(null, result.rows[0]);
                
            });

        })
    );


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.passwordhash);
    }
    
}