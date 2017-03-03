const express = require('express');
const protRoutes = express.Router();
const ensureLogin = require('connect-ensure-login');
const ensure = require('connect-ensure-login');



protRoutes.get('/secret', ensure.ensureLoggedIn(), (req, res, next) => {
  res.send('shsshhsshhshshshshhshs');


});

protRoutes.get('/snowden-files', ensure.ensureLoggedIn(), (req, res, next) => {
  res.send('george bush did 911');
});





module.exports = protRoutes;
