const Router         = require("koa-router");
const bodyParser     = require("koa-bodyparser");
const fresh          = require("fresh");
const etag           = require("etag");
const posts_model    = require("../models/posts");
const user_model     = require("../models/users");
const likes_model    = require("../models/likes");
const comments_model = require("../models/comments");
const can            = require("../permissions/posts")
const like_can       = require("../permissions/likes")
const auth           = require('../controllers/auth');
const {validatePost} = require("../controllers/validation");

const router      = new Router({prefix:'/api/v1/posts'});

router.get   ('/allPosts',                     getPostsAllNotAuth);
router.get   ('/:post_id([0-9]{1,})' ,         getPostByPostIdNotAuth);
router.get   ('/private/allPosts',             auth.authenticate(['jwt'], { session: false }), getPostsAllAuth);
router.get   ('/private/:post_id([0-9]{1,})',  auth.authenticate(['jwt'], { session: false }), getPostByPostIdAuth);
router.post  ('/private/:user_id([0-9]{1,})',  auth.authenticate(['jwt'], { session: false }), bodyParser(), validatePost, createPost);
router.delete('/private/:post_id([0-9]{1,})',  auth.authenticate(['jwt'], { session: false }), deletePost);

async function getPostsAllAuth(ctx, next)
{
    const requestor = { "role": ctx.state.user.role, "id" : ctx.state.user.UserID};

    await getPostsAllCommon( requestor, ctx, next);
}

async function getPostsAllNotAuth(ctx, next)
{
    const requestor = undefined;
    
    await getPostsAllCommon( requestor, ctx, next);
}

async function getPostsAllCommon(requestor, ctx, next)
{
    const posts = await posts_model.getAllPosts()

    if (posts != undefined) 
    {
        let response = [];
        for( let index in posts) 
        {
            response.push(await createPostResponse(posts[index], requestor))
        }

        ctx.response.set('Cache-Control', 'private, no-cache');
        ctx.response.set('ETag', etag(JSON.stringify(response)));
        if(fresh(ctx.request.headers, ctx.response.headers))
        {
            ctx.response.status = 304;
            ctx.response.body   = null;
            console.log("allposts 304")
        }
        else
        {
            ctx.response.status = 200;
            ctx.response.body   = response;
            console.log("allposts 200")
        }
    }
    else 
    {
        ctx.response.status = 404;
        console.log("allposts 404")
    }
}

async function getPostByPostIdAuth(ctx, next)
{
    const requestor = { "role": ctx.state.user.role, "id" : ctx.state.user.UserID};

    await getPostsByPostIdCommon( requestor, ctx, next);
}

async function getPostByPostIdNotAuth(ctx, next)
{
    const requestor = undefined;
    
    await getPostsByPostIdCommon( requestor, ctx, next);
}

async function getPostsByPostIdCommon(requestor, ctx, next)
{
    const postId = ctx.params.post_id;

    const post = await posts_model.getPostById(postId)
    if( post != undefined )
    {
        let response = await createPostResponse(post, requestor )

        ctx.response.set('Cache-Control', 'private, no-cache');
        ctx.response.set('ETag', etag(JSON.stringify(response)));
        if(fresh(ctx.request.headers, ctx.response.headers))
        {
            ctx.response.status = 304;
            ctx.response.body   = null;
            console.log("userposts 304")
        }
        else
        {
            ctx.response.status = 200;
            ctx.response.body   = response;
            console.log("userposts 200")
        }
    }
    else
    {
        console.log("Post doesn't exist")
        ctx.response.status = 404;
    }
}

async function createPostResponse(post, requestor)
{
    const user        = await user_model.getUserById(post.UserID);
    const numLikes    = await likes_model.getNumLikes(post.PostID);
    const numComments = await comments_model.getNumComments(post.PostID);

    let liked = false;
    let deletePostUri = "";
    let canDeletePost = false;
    let createLikeUri = "";
    let canCreateLike = false;
    let createCommentUri = "";
    let canCreateComment = false;

    
    if( requestor != undefined ) // So authenticated user
    {
        const post_delete_permission = can.delete(requestor.role, requestor.id, post.UserID)
        const like                   = await likes_model.getLikeById(post.PostID, requestor.id);
        if( like != undefined)
        {
            liked = true;
            const like_delete_permission = like_can.delete(requestor.role, requestor.id, like.UserID)
            if( like_delete_permission.granted)
            {
                canDeleteLike = true;
                deleteLikeUri = "/likes/private/"+like.LikeID;
            }
            else
            {
                canDeleteLike = false;
                deleteLikeUri = "";
            }
        }
        else
        {
            liked = false;
            canDeleteLike = false;
            deleteLikeUri = "";                    
        }
        if(post_delete_permission.granted)
        {
            deletePostUri =  "/posts/private/"+post.PostID;
            canDeletePost = true;
        }
        else
        {
            deletePostUri = "";
            canDeletePost = false;
        }
        createLikeUri    = "/likes/private/"+post.PostID+"/"+requestor.id;
        canCreateLike    = true;
        createCommentUri = "/comments/private/"+post.PostID+"/"+requestor.id;
        canCreateComment = true;
    }
    else // non authenticated case
    {
        deletePostUri = "";
        canDeletePost = false;
        createLikeUri = ""
        canCreateLike = false;
        deleteLikeUri = ""
        canDeleteLike = false;
        createCommentUri = "";
        canCreateComment = false;
    }

    return ({
        "PostID" : post.PostID,
        "Username": user.Username,
        "PostContent" : post.PostContent,
        "Created" : post.Created,
        "ImageURL" : post.ImageURL,
        "liked" : liked,
        
        "numLikes" : numLikes,
        "numComments" : numComments,

        "uriGetLikes" : "/likes/"+post.PostID,
        "uriGetLikesAuth" : "/likes/private/"+post.PostID,
        "uriCreateLike" : createLikeUri,
        "canCreateLike" : canCreateLike,
        "uriDeleteLike" : deleteLikeUri,
        "canDeleteLike" : canDeleteLike,

        "uriGetComments"     : "/comments/"+post.PostID,
        "uriGetCommentsAuth" : "/comments/private/"+post.PostID,
        "uriCreateComment"   : createCommentUri,
        "canCreateComment"   : canCreateComment,

        "uriDeletePost" : deletePostUri,
        "canDeletePost" : canDeletePost
        
        });
}

async function createPost(ctx, next)
{
    console.log(ctx.request.body)
    const permission = can.create(ctx.state.user.role, ctx.state.user.UserID, Number(ctx.params.user_id));
    if(!permission.granted)
    {
        ctx.response.status = 403;
    }
    else
    {
        const user_id = ctx.params.user_id;

        if (ctx.request.body.post_content == undefined) {
            ctx.response.status = 400;
            ctx.response.body = "post_content was not found"
            console.log("createpost 400")
        }
        else{
            const post_content = ctx.request.body.post_content
            const image_url    = ctx.request.body.image_url
            const post = await posts_model.createPost(user_id, post_content, image_url)

            ctx.response.status = 201;
            ctx.response.body = "post created";
            console.log("createpost 201")
        }
    }
}

async function deletePost(ctx, next) 
{
    const post_id = ctx.params.post_id
    if (post_id != undefined) 
    {
        let dbPost = await posts_model.getPostById(post_id)
        if( dbPost != null )
        {
            console.log(ctx.state.user.role, ctx.state.user.UserID, dbPost.UserID)
            const permission = can.delete(ctx.state.user.role, ctx.state.user.UserID, dbPost.UserID);
            if(!permission.granted)
            {
                ctx.response.status = 403;
            }
            else
            {
                let response = await posts_model.deletePost(post_id)
                deletePostRelevant(post_id)

                if (response.affectedRows != 0){
                    ctx.response.status = 200;
                    console.log("post deleted")
                }
                else {
                    ctx.response.status = 304;
                    console.log("internal error unable to delete post")
                }
            }
        }
        else
        {
            ctx.response.status = 400;
            console.log("no post to delete")  
        }
    }
    else 
    {
        ctx.response.status = 422;
        console.log("postid undefined")
    }
}

async function deletePostRelevant(post_id) {
    await comments_model.deletePostComments(post_id)
    await likes_model.deletePostLikes(post_id)

    console.log("related db entries deleted")
}

module.exports = router;
