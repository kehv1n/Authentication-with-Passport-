const express = require('express');
const protRoutes = express.Router();



protRoutes.get('/secret', (req, res, next) => {
res.send('shsshhsshhshshshshhshs');


});

protRoutes.get('/snowden-files', (req, res, next) => {
res.send('george bush did 911');  
});





module.exports = protRoutes;
