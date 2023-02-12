const express = require("express");
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
const sass = require("node-sass");
const fs = require("fs");
const path = require("path");

// Directory containing SCSS files
const srcDir = "./assets/scss";

// Directory for output CSS files
const destDir = "./assets/css";

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

app.use(express.static("./assets"));

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
    secret: "blahsomething", // code to encode
    saveUninitialized: false, // when user has not logged in, no need to save user's details
    resave: false, // no need to rewrite or save it again and again
    cookie: {
      maxAge: 1000 * 60 * 100, // expires after this much minutes(in milliseconds)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// use express router
app.use("/", require("./routes/index"));

app.listen(port, function (err) {
  if (err) {
    // console.log("Error: ", err);
    console.log(`Error in running the server : ${port}`);
  }

  console.log(`Server is running on port: ${port}`);
});
