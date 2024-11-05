/**
 * A module to authenticate requests sent to the server
 * @module controllers/auth
 * @author Josh
 */

const passport  = require('koa-passport');
const basicAuth = require('../strategies/basic');
const jwtAuth   = require('../strategies/jwt');

passport.use(basicAuth);
passport.use(jwtAuth);

module.exports = passport;

