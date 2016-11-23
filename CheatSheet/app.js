var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dotenv = require('dotenv').config();


var app = express();
var flash = require('connect-flash');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'Long and hard. Very long and very hard.',resave:true,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates

app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

/*var routes = require('./routes/index')(passport);
app.use('/', routes);*/



var routes = require('./routes/index')(passport);
app.use('/', routes);

var login = require('./routes/login')(passport);
app.use('/login', login);

var signup = require('./routes/signup')(passport);
app.use('/signup', signup);

var logout = require('./routes/logout')(passport);
app.use('/logout', logout);

var summarypage = require('./routes/summarypage')(passport);
app.use('/summarypage', summarypage);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
