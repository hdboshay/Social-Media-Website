//#region constants
const Router         = require("koa-router");
const bodyParser     = require("koa-bodyparser")
const fresh          = require("fresh");
const etag           = require("etag");
const posts_model    = require("../models/posts");
const users_model    = require("../models/users");
const likes_model    = require("../models/likes");
const auth           = require('../controllers/auth');
const can            = require("../permissions/likes")

//#endregion constants

//#region routes
const router = new Router({prefix:'/api/v1/likes'});
router.get   ('/:post_id([0-9]{1,})'                            , getLikesByPostIdNoAuth);
router.get   ('/private/:post_id([0-9]{1,})'                    , auth.authenticate(['jwt'], { session: false }), getLikesByPostIdAuth);
router.post  ('/private/:post_id([0-9]{1,})/:user_id([0-9]{1,})', auth.authenticate(['jwt'], { session: false }), bodyParser(), createLike);
router.delete('/private/:like_id([0-9]{1,})'                    , auth.authenticate(['jwt'], { session: false }), deleteLike);
//#endregion routes

//#region functions
async function getLikesByPostIdAuth(ctx, next)
{
    // authenticated route to get a list of likes by Post ID
    const requestor = { "role": ctx.state.user.role, "id" : ctx.state.user.UserID};

    await getLikesByPostIdCommon( requestor, ctx, next);
}

async function getLikesByPostIdNoAuth(ctx, next)
{
    const requestor = undefined;
    
    await getLikesByPostIdCommon( requestor, ctx, next);
}

async function getLikesByPostIdCommon( requestor, ctx, next) 
{
    // public function so no role based access control

    console.log("getLikesByPostIdCommon")
    const post_id = ctx.params.post_id
    const post_check = await posts_model.getPostById(post_id)

    if (post_check != undefined) {
        const likes = await likes_model.getPostLikes(post_id)

        let response = [];
        for( let index in likes) {
            let showDeleteButton;
            let deleteLikeUri;

            if( requestor != undefined )
            {
                const like_delete_permission = can.delete(requestor.role, requestor.id, likes[index].UserID)
                if(like_delete_permission.granted)
                {
                    showDeleteButton = true;
                    deleteLikeUri    = "/likes/private/"+likes[index].LikeID
                }
                else
                {
                    showDeleteButton = false;
                    deleteLikeUri = "";                    
                }
            }
            else
            {
                showDeleteButton = false;
                deleteLikeUri = "";
            }
            const user = await users_model.getUserById(likes[index].UserID);

            response.push ({
                 "like_id" : likes[index].LikeID,
                 "username": user.Username,
                 "uriDeleteLike" : deleteLikeUri,
                 "showDeleteButton" : showDeleteButton
                });
        }

        ctx.response.set('Cache-Control', 'private, no-cache');
        ctx.response.set('ETag', etag(JSON.stringify(response)));
        if(fresh(ctx.request.headers, ctx.response.headers))
        {
            ctx.response.status = 304;
            ctx.response.body   = null;
            console.log("getPostsLikes 304")
        }
        else
        {
            ctx.response.status = 200;
            ctx.response.body   = response;
            console.log("getPostsLikes 200")
        }
    }
    else{
        ctx.response.status = 404;
        ctx.response.body = "no post found";
        console.log("getPostsLikes 404")
    }
}

async function createLike(ctx, next) 
{
    const permission = can.create(ctx.state.user.role, ctx.state.user.UserID, Number(ctx.params.user_id))
    if(!permission.granted)
    {
        ctx.response.status = 403;
    }
    else
    {
        const post_id = ctx.params.post_id
        const user_id = ctx.params.user_id

        const post_check = await posts_model.getPostById(post_id)
            
        if (post_check != undefined) {
            const user_check = await users_model.getUserById(user_id)

            if (user_check != undefined) {
                const likecheck = await likes_model.getLikeById(post_id, user_id)
                if (likecheck == undefined) {
                     const like = await likes_model.createLike(post_id, user_id)
                    console.log(like)

                    ctx.response.status = 201;
                    ctx.response.body = "like created";
                }
                else{
                    ctx.response.status = 304;
                    ctx.response.body = "like already exists";
                }

            }
            else{
                ctx.response.status = 404;
                ctx.response.body = "no user found";
            }
        }
        else{
            ctx.response.status = 404;
            ctx.response.body = "no post found";
        }
    }
}

async function deleteLike(ctx, next) 
{
    const like_id = ctx.params.like_id;

    if( like_id != undefined )
    {
        like = await likes_model.getLikeByLikeId(like_id)

        if (like != undefined) {
            const permission = can.delete(ctx.state.user.role, ctx.state.user.UserID, like.UserID)
            if(!permission.granted)
            {
                ctx.response.status = 403;
            }
            else
            {
                const success = await likes_model.deleteLike(like_id);
                if(success.affectedRows != 0) 
                {
                    ctx.response.status = 200;
                }
                else 
                {
                    ctx.response.status = 404;
                    ctx.response.body = "no like to delete";
                }
            }
        }
        else{
            ctx.response.status = 404;
            ctx.response.body = "no like to delete"; 
        }
    }
    else
    {
        ctx.response.status = 404;
        ctx.response.body = "no like to delete"; 
    }
}


//#endregion function

module.exports = router;