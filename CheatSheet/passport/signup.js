var LocalStrategy   = require('passport-local').Strategy;
//var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var userManager = require('../cs-managers/userManager.js');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy(
        {
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        //function(req, username, password, done) {
        function(req,username,password,done) {
            //console.log('The username: '+req.query(username));
            //console.log('The password: '+req.query(password));
            //console.log('The email: '+req.query(email));
            //console.log('The fullname: '+req.query(fullname));

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                //User.findOne({ 'username' :  username }, function(err, user) {
                //userManager.getUserByUsername(username, function(err, result) {
                //console.log('!!!!!! req.body: '+req);
                //console.log('!!!!!! req.header: '+req.headers);
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
                        // if there is no user with that email
                        // create the user
                        //var newUser = {};

                        //newUser.username = req.body.username;
                        //newUser.password = createHash(req.body.password);
                        //newUser.email = req.body.email;
                        //newUser.fullname = req.body.fullname;

                        // save the user
                        userManager.createLocalUser(req.body.username,createHash(req.body.password),req.body.email,req.body.fullname,
                            function(err,result) {
                                if (err){
                                    console.log('Error in Saving user: '+err);  
                                    throw err;  
                                }
                                var theresults = result.rows[0];
                                if(theresults.passwordhash) delete theresults.passwordhash;
                                return done(null, theresults);
                            }
                        );
                        /*userManager.createLocalUser(req.body.username,createHash(req.body.password),req.body.email,req.body.fullname,
                            function(err) {
                                if (err){
                                    console.log('Error in Saving user: '+err);  
                                    throw err;  
                                }
                                userManager.getUserByUsername(req.body.username, function(err, result) {
                                    if (err){
                                        console.log('Error in getting user by username: '+err);  
                                        throw err;  
                                    }
                                    //newUser.id = result.rows[0].id;
                                    return done(null, newUser);
                                });
                            }
                        )*/
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
    }

}