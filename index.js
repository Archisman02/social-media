const express = require("express");
const env = require("./config/environment");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
// used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJwt = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const MongoStore = require("connect-mongo");
const sass = require("node-sass");
const fs = require("fs");
const path = require("path");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

// setup the chat server to be used with socket.io
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat server is listening on port 5000");
// const path = require("path");

// Directory containing SCSS files
const srcDir = path.join(__dirname, env.asset_path, "scss");

// Directory for output CSS files
const destDir = path.join(__dirname, env.asset_path, "css");

// Read all files in the src directory
fs.readdir(srcDir, (err, files) => {
  if (err) throw err;

  // Loop through each file
  files.forEach((file) => {
    // Only process files with .scss extension
    if (path.extname(file) === ".scss") {
      // Read the SCSS file
      fs.readFile(path.join(srcDir, file), "utf-8", (err, data) => {
        if (err) throw err;

        // Convert SCSS to CSS
        sass.render(
          {
            data: data,
          },
          (err, result) => {
            if (err) throw err;

            // Write the CSS to a file
            fs.writeFile(
              path.join(destDir, path.basename(file, ".scss") + ".css"),
              result.css,
              (err) => {
                if (err) throw err;
                console.log(`Converted ${file} to CSS`);
              }
            );
          }
        );
      });
    }
  });
});

app.use(
  bodyParser.urlencoded({
    // This is a middleware
    extended: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded());

app.use(express.static(env.asset_path));
// make the uploads path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "codeial",
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key, // code to encode
    saveUninitialized: false, // when user has not logged in, no need to save user's details
    resave: false, // no need to rewrite or save it again and again
    cookie: {
      maxAge: 1000 * 60 * 100, // expires after this much minutes(in milliseconds)
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://0.0.0.0:27017/codeial_development",
      autoRemove: "disabled",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// It is put after session is used because flash messages use session cookies
app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use("/", require("./routes/index"));

app.listen(port, function (err) {
  if (err) {
    // console.log("Error: ", err);
    console.log(`Error in running the server : ${port}`);
  }

  console.log(`Server is running on port: ${port}`);
});
