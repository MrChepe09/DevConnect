const express = require('express'); //Express library
const router = express.Router(); //Router function from exoress library
const jwt = require('jsonwebtoken'); //Json web token for session key tokens
const { check, validationResult } = require('express-validator'); //Express validator for body validators
const config = require('config'); //config for constants under config folder
const bcrypt = require('bcryptjs'); //bcrypt to unhash passwords

const auth = require('../../middleware/auth'); //auth middleware to check if correct token is present in the header
//for more information go to auth.js file in middleware folder
const User = require('../../models/User'); //User model to access database

// @route    GET api/auth
// @desc     Getting user data
// @access   Public
router.get(
  //Route Handle
  '/',
  //Middleware
  auth,
  //main function
  async (req, res) => {
    try {
      //Trying to fetch user data from database by using the userId we fetched from token in middleware
      const user = await User.findById(req.user.id).select('-password'); //Removing password feild before returning
      res.json(user); //Returning the user
    } catch (err) {
      //returning the Error with status
      console.error(err.message);
      res.status(500).send('Server Error!');
    }
  }
);

// @route    POST api/auth
// @desc     Authenticate User & Get Token
// @access   Public
router.post(
  //route handle
  '/',
  //check conditions for body data
  [
    check('email', 'Please include a valid Email').isEmail(),
    check('password', 'Password is Required!').exists(),
  ],
  //main function
  async (req, res) => {
    //return errors if returned by check functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //destructure body data
    const { email, password } = req.body;

    try {
      // See if a user exists
      let user = await User.findOne({ email });

      //if no user exists return error
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      //if user exists match the password in body with the hashed database password using the bcrypt function
      const isMatched = await bcrypt.compare(password, user.password);

      //if password do not matched return error
      if (!isMatched) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      //if password matched
      //Return a jsonwebtoken

      //create a payload
      const payload = {
        user: {
          id: user.id,
        },
      };

      //sign it using the secret key in config constants
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      //if any error during the whole process return error
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
