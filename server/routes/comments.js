//#region constants
const Router         = require("koa-router");
const bodyParser     = require("koa-bodyparser")
const fresh          = require("fresh");
const etag           = require("etag");
const posts_model    = require("../models/posts");
const users_model    = require("../models/users");
const comments_model = require("../models/comments");
const auth           = require('../controllers/auth');
const comments_can   = require("../permissions/comments")
const {validateComment} = require("../controllers/validation");

//#endregion constants

//#region routes
const router = new Router({prefix:'/api/v1/comments'});
router.get   ('/:post_id([0-9]{1,})'                            , getCommentsByPostIdNoAuth);
router.get   ('/private/:post_id([0-9]{1,})'                    , auth.authenticate(['jwt'], { session: false }), getCommentsByPostIdAuth);
router.post  ('/private/:post_id([0-9]{1,})/:user_id([0-9]{1,})', auth.authenticate(['jwt'], { session: false }), bodyParser(), validateComment, createComment);
router.delete('/private/:comment_id([0-9]{1,})'                 , auth.authenticate(['jwt'], { session: false }), deleteComment);

//#endregion routes

//#region functions
async function getCommentsByPostIdAuth(ctx, next)
{
    // authenticated route to get a list of comments by Post ID
    const requestor = { "role": ctx.state.user.role, "id" : ctx.state.user.UserID};

    await getCommentsByPostIdCommon( requestor, ctx, next);
}

async function getCommentsByPostIdNoAuth(ctx, next)
{
    const requestor = undefined;
    
    await getCommentsByPostIdCommon( requestor, ctx, next);
}

async function getCommentsByPostIdCommon( requestor, ctx, next) {
    // public function so no role based access control
    console.log("getPostComments")

    const post_id = ctx.params.post_id
    const post_check = await posts_model.getPostById(post_id)

    if (post_check != undefined) {
        const comments = await comments_model.getPostComments(post_id)

        let response = [];
        for( let index in comments) {

            let showDeleteButton;
            let deleteCommentUri;

            if( requestor != undefined )
            {
                const comment_delete_permission = comments_can.delete(requestor.role, requestor.id, comments[index].UserID)
                if(comment_delete_permission.granted)
                {
                    showDeleteButton = true;
                    deleteCommentUri = "/comments/private/"+comments[index].CommentID
                }
                else
                {
                    showDeleteButton = false;
                    deleteCommentUri = "";                    
                }
            }
            else
            {
                showDeleteButton = false;
                deleteCommentUri = "";
            }
            const user = await users_model.getUserById(comments[index].UserID);

            response.push ({
                 "comment_id" : comments[index].CommentID,
                 "username": user.Username,
                 "comment_content" : comments[index].CommentContent,
                 "uriDeleteComment" : deleteCommentUri,
                 "showDeleteButton" : showDeleteButton
                });
        }

        ctx.response.set('Cache-Control', 'private, no-cache');
        ctx.response.set('ETag', etag(JSON.stringify(response)));
        if(fresh(ctx.request.headers, ctx.response.headers))
        {
            ctx.response.status = 304;
            ctx.response.body   = null;
            console.log("getPostComments 304")
        }
        else
        {
            ctx.response.status = 200;
            ctx.response.body   = response;
            console.log("getPostComments 200")
        }
    }
    else{
        ctx.response.status = 404;
        ctx.response.body = "no post found";
    }
}

async function createComment(ctx, next) {
    console.log("createComment")

    const permission = comments_can.create(ctx.state.user.role, ctx.state.user.UserID, Number(ctx.params.user_id))
    if(!permission.granted)
    {
        ctx.response.status = 403;
    }
    else
    {
        const post_id = ctx.params.post_id
        const user_id = ctx.params.user_id
        const comment_content = ctx.request.body.comment_content

        const post_check = await posts_model.getPostById(post_id)
            
        if (post_check != undefined) {
            const user_check = await users_model.getUserById(user_id)

            if (user_check != undefined) {
                const comment = await comments_model.createComment(post_id, user_id, comment_content)

                ctx.response.status = 201;
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

async function deleteComment(ctx, next) {
    console.log("deleteComment")

    const comment_id = ctx.params.comment_id
    if(comment_id != undefined )
    {
        comment = await comments_model.getCommentByCommentId(comment_id)

        if (comment != undefined) {
            const permission = comments_can.delete(ctx.state.user.role, ctx.state.user.UserID, comment.UserID)
            if(!permission.granted)
            {
                ctx.response.status = 403;
            }
            else
            {
                const success = await comments_model.deleteComment(comment_id)
                if (success.affectedRows != 0) {

                    ctx.response.status = 200;
                }
                else{
                    ctx.response.status = 404;
                    ctx.response.body = "no comment to delete";
                }
            }
        }
        else{
            ctx.response.status = 404;
            ctx.response.body = "no comment to delete";
        }
    }
    else
    {
        ctx.response.status = 404;
        ctx.response.body = "no comment to delete"; 
    }
}
//#endregion function

module.exports = router;