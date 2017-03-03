const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const roomSchema = Schema({
  name: {type: String, required: true},
  desc: {type: String, required: true},
  picture: String,
  owner: {type: Schema.Types.ObjectId, ref: 'User'}
});

const Room = mongoose.model('Room', roomSchema); //Creates "room" out of the roomSchema

module.exports = Room;
