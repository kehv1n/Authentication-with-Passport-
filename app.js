const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts'); // Layouts to make our life easier
const mongoose     = require('mongoose'); // Mongoose for DB
const session      = require ('express-session'); // Saves sessions to our DB
const passport     = require('passport'); // Require to make basic authentication & social authentication
const LocalStrategy= require('passport-local').Strategy;  //
const bcrypt       = require('bcrypt'); /// REQUIRE bcrypt to encrypt passwords
const flash        = require('connect-flash'); //// REQUIRE FLASH TO SEND USERS MESSAGES
const fbStrategy   = require('passport-facebook').Strategy; // FACEBOOK Strategy
const gGStrategy   = require('passport-google-oauth').OAuth2Strategy;

const User         = require('./models/user-model.js'); //Require usrr Schema



mongoose.connect('mongodb://localhost/passport-app');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts); // Use Layouts

app.use(session({ //Use Sessions
  secret: 'It was him Mr.Krabs! Heee Was Number Oneee!',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize()); //Use Passport
app.use(passport.session()); //Use Passport Sessions
app.use(flash()); /// USES FLASH

passport.use(new LocalStrategy((username, password, next) => { //Use Local Strategy
  User.findOne({ userName: username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.encryptedPassword)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));
passport.use(new gGStrategy({  /////GOOGLE STRATEGY
  clientID: '',
  clientSecret: '',
  callbackURL: 'http://localhost:3000/auth/google/callback'
  },(accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));

passport.use(new fbStrategy({ /////FACEBOOK STRATEGY
  clientID: '',
  clientSecret: '',
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
},(accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));

passport.serializeUser((user, cb) => {
  if (user.provider) {
    cb(null, user);
  } else {
    cb(null, user._id);

  }
});

passport.deserializeUser((id, cb) => {
  if (id.provider) {
    cb(null, id);
    return;
  }
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


/////--------ROUTES GO HERE-------------//////
const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth-routes.js');
app.use('/', authRoutes);

const protRoutes = require('./routes/protected-routes.js');
app.use('/', protRoutes);

const roomRoutes = require('./routes/rooms-routes.js');
app.use('/',roomRoutes);
/////--------ROUTES GO HERE-------------//////

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
