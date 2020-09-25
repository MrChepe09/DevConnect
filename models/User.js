//Database Model i.e Mongo database Schema
const mongoose = require('mongoose'); //Importing Mongoose library

//Defining new Schema -- User
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Exporting Schema Model as User
module.exports = User = mongoose.model('user', UserSchema);
