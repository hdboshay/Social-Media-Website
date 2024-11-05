/**
 * A module to validate user inputs sent to the server
 * @module controllers/validation
 * @author Josh
 */
const {Validator, ValidationError} = require('jsonschema');
const create_post_schema    = require('../schemas/posts.schema.js');
const create_user_schema    = require('../schemas/users.schema.js');
const create_comment_schema = require('../schemas/comments.schema.js');

const v = new Validator();

/**
 * Validates the post
 * @param {object} ctx - context of the request
 * @returns {boolean} true if validated, false if not
 * @see schemas/posts for JSON schema definition
 */
exports.validatePost = async (ctx, next) => {

  const validationOptions = 
  {
    throwError: true,
    allowUnknownAttributes: false
  };

  const body = ctx.request.body;

  try 
  {
    v.validate(body, create_post_schema, validationOptions);
    await next();
  } 
  catch (error)
  {
    if (error instanceof ValidationError) 
    {
      ctx.body = error;
      ctx.status = 400;      
    }
    else 
    {
      throw error;
    }
  }
}

/**
 * Validates the user
 * @param {object} ctx - context of the request
 * @returns {boolean} true if validated, false if not
 * @see schemas/user for JSON schema definition
 * @throws {error}
 */
exports.validateUser = async (ctx, next) => {

    const validationOptions = 
    {
      throwError: true,
      allowUnknownAttributes: false
    };
  
    const body = ctx.request.body;
  
    try 
    {
      v.validate(body, create_user_schema, validationOptions);
      await next();
    } 
    catch (error)
    {
      if (error instanceof ValidationError) 
      {
        ctx.body = error;
        ctx.status = 400;      
      }
      else 
      {
        throw error;
      }
    }
}

/**
 * Validates the comment
 * @param {object} ctx - context of the request
 * @returns {boolean} true if validated, false if not
 * @see schemas/user for JSON schema definition
 */
exports.validateComment = async (ctx, next) => {

    const validationOptions = 
    {
      throwError: true,
      allowUnknownAttributes: false
    };
  
    const body = ctx.request.body;
  
    try 
    {
      v.validate(body, create_comment_schema, validationOptions);
      await next();
    } 
    catch (error)
    {
      if (error instanceof ValidationError) 
      {
        ctx.body = error;
        ctx.status = 400;      
      }
      else 
      {
        throw error;
      }
    }
}
