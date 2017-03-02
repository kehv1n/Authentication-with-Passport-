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
      if (err) {
        res.render("auth/signup-view", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login-view.ejs');
});

authRoutes.post('/login',
  passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true,
    passReqToCallback : true
  })
);

module.exports = authRoutes;
