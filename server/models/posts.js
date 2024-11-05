/**
 * A module to handle requests requiring database access involving the posts table
 * @module models/posts
 * @author Josh
 */
const db = require('../helpers/database');

/**
 * Sends a query and values to a helper to get username for a particular user id from the database
 * Then adds the username to the post in the list before returning it
 * @param {number} posts - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function addUsername(posts){
    for (const post of posts) 
    {
        let query = "SELECT Username FROM users WHERE UserID = ?;"
        let values = [post.UserID];
        const [user] = await db.run_query(query, values)
        post.Username = user[0].Username
    }
    return posts
}

/**
 * Sends a query and values to a helper to get all the posts from the database
 * @returns {object} mysqljs results object containing indexable rows
 */
async function getAllPosts() {
    let query = "SELECT * FROM posts ORDER BY PostID DESC;"
    let values = [];
    const [posts] = await db.run_query(query, values)
    return addUsername(posts)
}

/**
 * Sends a query and values to a helper to get a post given a particular id from the database
 * @param {number} post_id - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function getPostById(post_id) {
    let query = "SELECT * FROM posts WHERE PostID = ?;"
    let values = [post_id];
    const [post] = await db.run_query(query, values)
    return post[0]
}

/**
 * Sends a query and values to a helper to ge posts for a particular user id from the database
 * @param {number} user_id - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function getPostsByUser(user_id) {
    let query = "SELECT * FROM posts WHERE UserID = ? ORDER BY PostID DESC;"
    let values = [user_id];
    const [posts] = await db.run_query(query, values)
    return addUsername(posts)
}

/**
 * Sends a query and values to a helper to create a post from the database
 * @param {number} user_id - id for post to be included in query
 * @param {string} post_content - post content for comment to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function createPost(user_id, post_content, image_url) {
    let query = "INSERT INTO posts (UserID, PostContent, ImageURL) VALUES (?, ?, ?);"
    let values = [user_id, post_content, image_url];
    const [result] = await db.run_query(query, values)
    const post_id = result.insertId

    return getPostById(post_id)
}

/**
 * Sends a query and values to a helper to delete a comment given a particular id from the database
 * @param {number} post_id - id for post to be included in query
 * @returns {object} mysqljs results object containing indexable rows
 */
async function deletePost(post_id) {
    let query = "DELETE FROM posts WHERE PostID = ?;"
    let values = [post_id];
    const [result] = await db.run_query(query, values)

    return result
}

module.exports = {
    getAllPosts, 
    getPostById, 
    getPostsByUser, 
    createPost, 
    deletePost
}