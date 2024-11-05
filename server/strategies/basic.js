const BasicStrategy = require('passport-http').BasicStrategy;
const user_model = require('../models/users');
const bcrypt = require('bcrypt');

/**
 * Verifies the password provided against the password stored for the provided user
 * @param {object} user - user to be validated agaisnt
 * @param {string} password - password to validate
 * @returns {boolean} true if validated, false if not
 */
const verifyPassword = async function (user, password) {
  // compare user.password with the password supplied
  return await bcrypt.compare(password, user.UserPassword);
}

/**
 * Checks the username and password inputted by the user 
 * @param {string} username - user inputted username for logging in
 * @param {string} password - user inputted password for logging in
 * @param {function} done - The Koa done callback
 * @returns {error} if error occurs
 * @returns {object} returns user object if successful
 * @returns {undefined} if username or password incorrect
 */
const checkUserAndPass = async (username, password, done) => {
    // look up the user and check the password if the user exists
    // call done() with either an error or the user, depending on outcome
    try 
    {
      user = await user_model.getUserByUsername(username);
    } 
    catch (error) 
    {
      console.error(`Error during authentication for user ${username}`);
      return done(error);
    }
  
    if (user != undefined ) 
    {
      if (await verifyPassword(user, password)) 
      {
        console.log(`Successfully authenticated user ${username}`);
        return done(null, user);
      } 
      else 
      {
        console.log(`Password incorrect for user ${username}`);
      }
    } 
    else 
    {
      console.log(`No user found with username ${username}`);
    }
    return done(null, undefined);  // username or password were incorrect
  }
  
  const strategy = new BasicStrategy(checkUserAndPass);
  module.exports = strategy;
  