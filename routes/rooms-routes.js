const express = require('express');
const roomRoutes = express.Router();
const Room = require('../models/room-model.js');
const multer = require('multer');

const ensureLogin = require('connect-ensure-login');
const uploads = multer({
    dest:__dirname + '/../public/uploads'
}); // Where do you want the images to upload to?

// IMPORTANT!! explenation about sessions _id's and the _id in the DB:
// req.user comes from the session being established. The _id is stored in the session (and is technicallly not the same _id that is in the database, altough it has the same _id).
// Furthermore, it references towards the _id that is saved in the database and then retrieves the information associated with the _id.
// Moreover, this is also called deserializing. On the other hand serializing is taking the _id from the database and giving it to different sessions.

// Flow of cookie to session to db:
// Cookie is stored in PC and delegates/ references towards a session that is stored in a SERVER (it wouldnt make sense to store the session in the pc otherwise).
// Session sees the cookie, authenticates and sees its own _id (which is basically the same _id that is in the DB). Session then goes to the DB and grabs the
// information requested and delivers it to the website.
// In other words, if your cookie is deleted you have to sign in again because you have no way to reach the session, which contains the id to go to the db an grab ur stuff or the stuff of the user
// you are trying to access.

roomRoutes.get('/rooms/new', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    res.render('rooms/new.ejs', {
        message: req.flash('success')[0]
    });
});

roomRoutes.post('/rooms',
ensureLogin.ensureLoggedIn(),
uploads.single('picture'),
(req, res, next) => {
  const filename = req.file.filename;

    const newRoom = new Room({
        name: req.body.name,
        desc: req.body.desc,
        picture: `/uploads/${filename}`,
        owner: req.user._id // <---- We add the user
    });

    newRoom.save((err) => {
        if (err) {
            next(err);
            return;
        } else {
            req.flash('success', 'Your room has been created.');
            res.redirect('/rooms/new');
        }

    });
});

roomRoutes.get('/my-rooms', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    Room.find({
        owner: req.user._id
    }, (err, myRooms) => {
        if (err) {
            return next(err);
        }

        res.render('rooms/index', {
            rooms: myRooms
        });
    });

});


module.exports = roomRoutes;
