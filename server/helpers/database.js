/**
 * A module to run SQL queries on MySQL on behalf of the API models.
 * @module helpers/database
 * @author Josh
 * @see models/* for the models that require this module
 * @see models/schemas/* for the models for how the database is layed out
 */

const mysql  = require('mysql2');  
const dotenv = require("dotenv");

dotenv.config()

/**
 * Create a mysql pool with connection parameters from the config.js file
 */
const pool = mysql.createPool({
  port: process.env.MYSQL_PORT,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_USERS_DATABASE
 }).promise()

/**
 * Run an SQL query against the DB, end the connection and return the result.
 * @param {string} query - Query SQL query string in sqljs format
 * @param {array|number|string} values - The values to inject in to the query string.
 * @returns {object} mysqljs results object containing indexable rows
 * @throws {DatabaseException} Custom exception for DB query failures
 */

async function run_query(query, values)
{
  try 
  {
    let data = await pool.query(query, values);
    return data;
  } 
  catch (error) 
  {
    console.error(error, query, values);
    throw 'Database query error'
  }
}

module.exports = {run_query};