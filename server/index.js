/**
 * A module to provide the main entry point to the Server App
 * @module index
 * @author Josh
 */


/** Use an App object */
const app = require("./app")

/** Define the server port using the environment variable from the .env file */
let port = process.env.SERVER_PORT

/** Set the app listening for connection requests on the port */
app.listen(port, () => {
    console.log("Server started on port " + port);
});

/** Export the app object */
module.exports = app;