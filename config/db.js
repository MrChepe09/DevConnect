const mongoose = require('mongoose'); //mongoose library
const config = require('config'); //Constants in default.json in config folder
const db = config.get('mongoURI'); //Database URI in config constants

//Instead of Promises we will be using *Async-Await*
const connectDB = async () => {
  try {
    //Trying to connect to the database URI
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.log(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

//Exporting the connection function which is then called in Server.js File
module.exports = connectDB;
