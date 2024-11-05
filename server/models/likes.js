/**
 * A module to handle requests requiring database access involving the likes table
 * @module models/likes
 * @author Josh
 */
const db = require('../helpers/database');

/**
 * Sends a query and values to a helper to get all the likes from the database
 * @returns {object} mysqljs results object containing indexable rows
 */
async function getAllLikes() {
    let query = "SELECT * FROM likes;"
    let values = [];
    const [likes] = await db.run_query(query, values)
    return likes
}

/**
 * Sends a query and values to a helper to get all the likes for a particular post from the database
 * @param {number} post_id - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function getPostLikes(post_id) {
    let query = "SELECT * FROM likes WHERE PostID = ?;"
    let values = [post_id];
    const [likes] = await db.run_query(query, values)
    return likes
}

/**
 * Sends a query and values to a helper to get the number of likes for a particular post from the database
 * @param {number} post_id - id for post to be included in query
 * @returns {number} mysqljs results object containing indexable rows
 */
async function getNumLikes(post_id) {
    let query = "SELECT COUNT(*) AS c FROM likes WHERE PostID = ?;"
    let values = [post_id];
    const [likes] = await db.run_query(query, values)
    return likes[0].c
}

/**
 * Sends a query and values to a helper to get a like for a particular post and user from the database
 * @param {number} post_id - id for post to be included in query
 * @param {number} user_id - id for user to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function getLikeById(post_id, user_id) {
    let query = "SELECT * FROM likes WHERE (PostID = ? AND UserID = ?);"
    let values = [post_id, user_id];
    const [likes] = await db.run_query(query, values)
    return likes[0]
}

/**
 * Sends a query and values to a helper to create a like for a particular post from the database
 * @param {number} post_id - id for post to be included in query
 * @param {number} user_id - id for user to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function createLike(post_id, user_id) {
    let query = "INSERT INTO likes (PostID, UserID) VALUES (?,?);"
    let values = [post_id, user_id];
    const [likes] = await db.run_query(query, values)
    return likes
}

/**
 * Sends a query and values to a helper to get a like given a particular id from the database
 * @param {number} like_id - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function getLikeByLikeId(like_id) {
    let query = "SELECT * FROM likes WHERE (LikeID = ?);"
    let values = [like_id];
    const [likes] = await db.run_query(query, values)
    return likes[0]
}

/**
 * Sends a query and values to a helper to delete a like given a particular id from the database
 * @param {number} like_id - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function deleteLike(like_id) {
    let query = "DELETE FROM likes WHERE (LikeID = ?);"
    let values = [like_id];
    const [likes] = await db.run_query(query, values)
    return likes
}

/**
 * Sends a query and values to a helper to delete all likes given a particular post_id from the database
 * @param {number} post_id - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
 async function deletePostLikes(post_id) {
    let query = "DELETE FROM likes WHERE PostID = ?;"
    let values = [post_id];
    const [likes] = await db.run_query(query, values)
    return likes
}

module.exports = {
    getAllLikes,
    getPostLikes,
    getNumLikes,
    getLikeById,
    createLike,
    getLikeByLikeId,
    deleteLike,
    deletePostLikes
}