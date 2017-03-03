const express    = require("express");
const authRoutes = express.Router();
const passport = require('passport');

// User model
const User       = require("../models/user-model");

// Bcrypt to encrypt passwords
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup-view");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;


  if (username === "" || password === "") {
    res.render("auth/signup-view", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup-view", { message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser =  User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: username,
      encryptedPassword: hashPass
    });

    newUser.save((err) => {
      if (err) { // IF problem
        res.render("auth/signup-view", { message: "Something went wrong" });
      } else { // If no problem ;)
        req.flash('success' , 'You have been registered. Try logging in');
        res.redirect("/");
      }
    });
  });
});

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login-view.ejs', {
    errorMessage: req.flash('message')
  });
});

authRoutes.post('/login',
  passport.authenticate('local', {
    successReturnToOrRedirect : '/', //Saves the previous location of the user
    failureRedirect : '/login', //IF they try to go to a non-authenticated page
    failureFlash : true, // Sends them there once they are authenticated
    successFlash : 'You have been logged in, user!',
    passReqToCallback : true
  })
);

authRoutes.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('success', 'You have been logged out');
  res.redirect('/');

});
 ///////////////// FACEBOOK AUTH ////////////////////////
authRoutes.get("/auth/facebook", passport.authenticate("facebook"));
authRoutes.get('/auth/facebook/callback', passport.authenticate("facebook", {
  successRedirect: '/', ///Where do you want take the user on success of the login
  failureRedirect: '/login' //Where do you want to take the user upon failure of login
}));

///////////////// GOOGLE AUTH ////////////////////////
authRoutes.get("/auth/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

authRoutes.get("/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/login",
  successRedirect: "/"
}));

module.exports = authRoutes;
