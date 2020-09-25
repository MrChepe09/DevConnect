const jwt = require('jsonwebtoken'); //json web token for the session token
const config = require('config'); //config constants

//defining middleware function
module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token specified in header
  if (!token) {
    return res.status(401).json({ msg: 'No token, Authorization Denied!' });
  }

  // Verify if a genuine token is given using the secret key in config constants
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    //set the user id in the token to the request user [to be used in route]
    req.user = decoded.user;
    next();
  } catch (err) {
    //return error
    res.status(401).json({ msg: 'Token is not Valid!' });
  }
};
