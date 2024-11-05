const Koa             = require("koa");
const cors            = require("koa-cors");
const dotenv          = require("dotenv");
const posts           = require("./routes/posts");
const users           = require("./routes/users");
const comments        = require("./routes/comments");
const likes           = require("./routes/likes");

dotenv.config()

const app = new Koa();

const cors_options = 
{
    origin: process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS,
    headers: process.env.CORS_HEADERS
}

app.use(cors(cors_options));

app.use(users.routes());
app.use(posts.routes());
app.use(likes.routes());
app.use(comments.routes());

module.exports = app;