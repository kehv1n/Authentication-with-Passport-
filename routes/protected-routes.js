const express = require('express');
const protRoutes = express.Router();
const ensureLogin = require('connect-ensure-login');



protRoutes.get('/secret', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.send('shsshhsshhshshshshhshs');


});

protRoutes.get('/snowden-files', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.send('george bush did 911');
});





module.exports = protRoutes;
