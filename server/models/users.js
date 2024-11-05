/**
 * A module to handle requests requiring database access involving the posts table
 * @module models/users
 * @author Josh
 */
const db = require('../helpers/database');

/**
 * Sends a query and values to a helper to get all the users from the database
 * @returns {object} mysqljs results object containing indexable rows
 */
async function getAllUsers() {
    let query = "SELECT * FROM users;"
    let values = [];
    const [users] = await db.run_query(query, values)
    return users
}

/**
 * Sends a query and values to a helper to get a user given a particular id from the database
 * @param {number} id - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function getUserById(id) {
    let query = "SELECT * FROM users WHERE UserID = ?;"
    let values = [id];
    const [user] = await db.run_query(query, values)
    return user[0]
}

/**
 * Sends a query and values to a helper to get a user given a particular username from the database
 * @param {string} username - username for user to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function getUserByUsername(username) {
    let query = "SELECT * FROM users WHERE Username = ?;"
    let values = [username];
    const [user] = await db.run_query(query, values)
    return user[0]
}

/**
 * Sends a query and values to a helper to create a user from the database
 * @param {string} username - username for user to be included in query
 * @param {string} password - password for user to be included in query
 * @param {string} role     - role     for user to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
 async function createUser(username, password, role) {
    let query = "INSERT INTO users (Username, UserPassword, role) VALUES (?, ?, ?);"
    let values = [username, password, role];
    const [result] = await db.run_query(query, values)
    const id = result.insertId

    return getUserById(id)
}

/**
 * Sends a query and values to a helper to delete a user given a particular id from the database
 * @param {number} user_id - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
 async function deleteUser(user_id) {
    let query = "DELETE FROM users WHERE UserID = ?;"
    let values = [user_id];
    const [user] = await db.run_query(query, values)
    return user[0]
}

module.exports = {
    getAllUsers, 
    getUserById, 
    getUserByUsername, 
    createUser,
    deleteUser
}