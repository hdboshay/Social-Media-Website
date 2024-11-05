/**
 * A module to handle requests requiring database access involving the comments table
 * @module models/comments
 * @author Josh
 */
const db = require('../helpers/database');

/**
 * Sends a query and values to a helper to get all the comments from the database
 * @returns {object} mysqljs results object containing indexable rows
 */
async function getAllComments() {
    let query = "SELECT * FROM comments;"
    let values = [];
    const [comments] = await db.run_query(query, values)
    return comments
}

/**
 * Sends a query and values to a helper to get all the comments for a particular post from the database
 * @param {number} post_id - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function getPostComments(post_id) {
    let query = "SELECT * FROM comments WHERE PostID = ? ORDER BY CommentID DESC;"
    let values = [post_id];
    const [comments] = await db.run_query(query, values)
    return comments
}

/**
 * Sends a query and values to a helper to get the number of comments for a particular post from the database
 * @param {number} post_id - id for post to be included in query
 * @returns {number} mysqljs results object containing indexable rows
 */
async function getNumComments(post_id) {
    let query = "SELECT COUNT(*) AS c FROM comments WHERE PostID = ?;"
    let values = [post_id];
    const [comments] = await db.run_query(query, values)
    return comments[0].c
}

/**
 * Sends a query and values to a helper to create a comment for a particular post from the database
 * @param {number} post_id - id for post to be included in query
 * @param {number} user_id - id for user to be included in query
 * @param {string} comment_content - content for comment to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function createComment(post_id, user_id, comment_content) {
    let query = "INSERT INTO comments (PostID, UserID, CommentContent) VALUES (?,?, ?);"
    let values = [post_id, user_id, comment_content];
    const [comments] = await db.run_query(query, values)
    return comments
}

/**
 * Sends a query and values to a helper to get a comment given a particular id from the database
 * @param {number} comment_id - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function getCommentByCommentId(comment_id) {
    let query = "SELECT * FROM comments WHERE CommentID = ?;"
    let values = [comment_id];
    const [comments] = await db.run_query(query, values)
    return comments[0]
}

/**
 * Sends a query and values to a helper to delete a comment given a particular id from the database
 * @param {number} comment_id - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function deleteComment(comment_id) {
    let query = "DELETE FROM comments WHERE CommentID = ?;"
    let values = [comment_id];
    const [comments] = await db.run_query(query, values)
    return comments
}

/**
 * Sends a query and values to a helper to delete all comments given a particular post_id from the database
 * @param {number} post_id - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
 async function deletePostComments(post_id) {
    let query = "DELETE FROM comments WHERE PostID = ?;"
    let values = [post_id];
    const [comments] = await db.run_query(query, values)
    return comments
}

module.exports = {
    getAllComments,
    getPostComments,
    getNumComments,
    createComment,
    getCommentByCommentId,
    deleteComment,
    deletePostComments
}