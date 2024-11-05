const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt  = require('passport-jwt').ExtractJwt;
const user_model = require('../models/users');

const dotenv      = require("dotenv");

dotenv.config()

let jwt_opts = {}
jwt_opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwt_opts.secretOrKey    = process.env.JWT_KEY;

/**
 * Checks the JWT Token for a request
 * @param {object} jwt_payload - user inputted username for logging in
 * @param {function} done - The Koa done callback
 * @returns {error} if error occurs
 * @returns {object} returns user object if successful
 * @returns {undefined} if user found is undefined
 */
const checkJWTToken = async (jwt_payload, done) => {
    try 
    {
      user = await user_model.getUserById(jwt_payload.userId);
    } 
    catch (error) 
    {
        console.error(`Error during authentication for user ID ${jwt_payload.userId}`);
        return done(error);
    }
  
    if (user != undefined ) 
    {
        console.log(`Successfully authenticated user ${user.Username}`);
        return done(null, user);
    } 
    else
    {
        return done(null, false);  // user couldn't be found
    }
}
   
const strategy = new JwtStrategy(jwt_opts, checkJWTToken);
module.exports = strategy;
