const Router         = require("koa-router");
const bodyParser     = require("koa-bodyparser")
const jsonwebtoken   = require('jsonwebtoken');
const posts_model    = require("../models/posts");
const users_model    = require("../models/users");
const likes_model    = require("../models/likes");
const comments_model = require("../models/comments");
const can            = require("../permissions/users")
const auth           = require('../controllers/auth');
const {validateUser} = require("../controllers/validation");
const bcrypt         = require('bcrypt');

const router = new Router({prefix:'/api/v1/users'});

// creating users should be available to anyone so they can always register with the app, so no authentication handlers
router.post('/create/user',                           bodyParser(), validateUser, createUserNotAuth);
router.post('/create/admin',                          auth.authenticate(['jwt'], { session: false }), bodyParser(), validateUser, createUserAuth);

// Require basic authentication to get a JWT token for a username (requires username & password)
router.get ('/getjwt/:username([0-9a-zA-Z]{1,})',     auth.authenticate(['basic'], { session: false }), getJwtForUsername );

// Require a JWT token (containing the users ID) for all other routes
router.get ('/',                                      auth.authenticate(['jwt'], { session: false }), getAll);
router.get ('/byId/:id([0-9]{1,})',                   auth.authenticate(['jwt'], { session: false }), getById);
router.get ('/byUsername/:username([0-9a-zA-Z]{1,})', auth.authenticate(['jwt'], { session: false }), getByUsername);
router.delete ('/:user_id([0-9]{1,})',                auth.authenticate(['jwt'], { session: false }), deleteUser);

async function getAll(ctx, next)
{
    const permission = can.readAll(ctx.state.user.role)
    if(!permission.granted)
    {
        ctx.response.status = 403;
    }
    else
    {
        const users = await users_model.getAllUsers()
        if (users.length != 0) {
            for( let index in users) {
                // TODO: need to check can.delete permissions etc
                users[index].uriDeleteUser    = "/" + users[index].UserID
                users[index].showDeleteButton = true
            }
            ctx.response.status = 200;
            ctx.response.body = users;
            console.log("users/getAll 200")
        }
        else{
            ctx.response.status = 404;
            ctx.response.body = "no users found";
            console.log("users/getAll 404")
        }
    }
}

async function getJwtForUsername(ctx, next) 
{
    console.log(ctx.state.user.UserPassword)
    const permission = can.read(ctx.state.user.role, ctx.state.user.Username, ctx.params.username)
    const password = ctx.state.user.UserPassword
    if(!permission.granted)
    {
        ctx.response.status = 403;
    }
    else
    {
        const username = ctx.params.username
        const user = await users_model.getUserByUsername(username)

        if( user != undefined )
        {
            const payload = { userId: user.UserID }
            const secret = process.env.JWT_KEY
            const token = jsonwebtoken.sign(payload, secret)

            ctx.response.body = {"jwt": token, "UserID": user.UserID, "Role": user.role, "Created":user.Created }
            ctx.status = 200;

            console.log("login 200")
        }
        else
        {
            ctx.status = 404;
        }
    }
}

async function getById(ctx, next)
{
    const permission = can.read(ctx.state.user.role, ctx.state.user.UserID, Number(ctx.params.id))
    if(!permission.granted)
    {
        ctx.response.status = 403;
    }
    else
    {
        const id = ctx.params.id
        const user = await users_model.getUserById(id)

        if (user) {
            ctx.status = 200;
            ctx.response.body = user;
            console.log("users/getById 200")    
        }
        else{
            ctx.response.status = 404;
            ctx.response.body = "no user found";
            console.log("users/getById 404")
        }
    }
}

async function getByUsername(ctx, next)
{
    const permission = can.read(ctx.state.user.role, ctx.state.user.Username, ctx.params.username)
    if(!permission.granted)
    {
        ctx.response.status = 403;
    }
    else
    {
        const username = ctx.params.username
        const user = await users_model.getUserByUsername(username)

        if (user) {
            ctx.status = 200;
            ctx.response.body = user;
            console.log("users/getByUsername 200")    
        }
        else{
            ctx.response.status = 404;
            ctx.response.body = "no user found";
            console.log("users/getByUsername 404")
        }
    }
}

async function createUserNotAuth(ctx,next) {
    const requestor = { "role" : null }

    await commonCreateUser( requestor, ctx, next);
}

async function createUserAuth(ctx, next) {
    const requestor = { "role": ctx.state.user.role, "id" : ctx.state.user.UserID};

    await commonCreateUser( requestor, ctx, next);
}

async function commonCreateUser(requestor, ctx,next)
{
    console.log("create user")

    const {username, password, role} = ctx.request.body
    console.log(password)
    let user = {}

    const userExists = await users_model.getUserByUsername(username)
    if (!userExists) {
        if (role == "admin" && requestor.role != "admin") {
            ctx.response.status = 403;
            ctx.response.body   = "not permitted to create admin account";
            console.log("createUser 403")
        }
        else{
            const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
            const hashedPassword = await bcrypt.hash(password, salt)
            user = await users_model.createUser(username, hashedPassword, role)

            ctx.response.status = 201;
            ctx.response.body   = user;
            console.log("createUser 201")
        }
    }
    else{
        ctx.response.status = 304;
        ctx.response.body   = "user already exists";
        console.log("createUser 304")
    }
}

async function deleteUser(ctx,next)
{
    console.log("delete user")
    const user_id = ctx.params.user_id
    const userExists = await users_model.getUserById(user_id)

    if (userExists) {
        const permission = can.delete(ctx.state.user.role, ctx.state.user.Username, userExists.Username)
        if(!permission.granted)
        {
            ctx.response.status = 403;
        }
        else
        {
            await deleteUserRelevant(user_id)
            user = await users_model.deleteUser(user_id)

            ctx.response.status = 200;
            ctx.response.body   = "user deleted";
            console.log("deleteUser 201")
        }
    }
    else{
        ctx.response.status = 404;
        ctx.response.body   = "user doesnt exist";
        console.log("deleteUser 404")
    }
}

async function deleteUserRelevant(user_id) {
    const posts = await posts_model.getPostsByUser(user_id)

    for( let index in posts) {
        let post_id = posts[index].PostID

        await comments_model.deletePostComments(post_id)
        await likes_model.deletePostLikes(post_id)
        await posts_model.deletePost(post_id)
    }
    console.log("related db entries deleted")
}

module.exports =  router;