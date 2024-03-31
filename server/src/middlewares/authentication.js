const {expressjwt} = require('express-jwt');
const dotenv = require('dotenv');

dotenv.config();

const jwtMiddleware = expressjwt({
  secret: process.env.JWT_SECRET_KEY, // Use the same secret as when you signed the JWT
  algorithms: ['HS256'], // Ensure the algorithm matches the one used to sign the token
  requestProperty: 'auth', // The decoded JWT payload is attached to req.auth
});

module.exports = {
  jwtMiddleware
}