const express = require('express'); //Express Library
const router = express.Router(); //Router function from Express
const gravatar = require('gravatar'); //Gravatar library for Avatars
const bcrypt = require('bcryptjs'); //Bcrypt to hash passwords
const jwt = require('jsonwebtoken'); //Jsonwebtoken for session keys to login user and get information
const { check, validationResult } = require('express-validator'); //Express validator for form validation
//check function checks for potential errors
//validationResult prints out the errors that have occured during checks

const config = require('config'); //config for constants
const User = require('../../models/User'); //user model for database

// @route    POST api/users
// @desc     Register User
// @access   Public
router.post(
  //Route handle
  '/',
  //checks for the body of API request
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid Email').isEmail(),
    check(
      'password',
      'Please enter a valid password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  //main function
  async (req, res) => {
    //getting all errors occured during check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //printing errors if not empty
      return res.status(400).json({ errors: errors.array() });
    }
    //Destructuring Body
    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      // If user exists return Error
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User Already Exists ' }] });
      }

      // Get Users Gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      // Create a new user using the Credentials in body
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt Password

      // Create a salt
      const salt = await bcrypt.genSalt(10);

      // Encrypt password using salt
      user.password = await bcrypt.hash(password, salt);

      // save to Database
      await user.save();

      // Return jsonwebtoken

      //Select a payload
      const payload = {
        user: {
          id: user.id,
        },
      };

      //Sign it using a key from config constants
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          //If correctly signed return the token
          res.json({ token });
        }
      );
      //If error occured return the status and message
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
