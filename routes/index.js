const express = require("express");

const router = express.Router();

const homeController = require("../controllers/home_controller");

console.log("router loaded");

router.get("/", homeController.home);
router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));
router.use("/reset-password", require("./resetPassword"));
router.use("/likes", require("./likes"));
router.use("/friends", require("./friends"));

router.use("/api", require("./api"));
// for any further routes, access from here
// router.use('/routerName', require('./routerfile'));

module.exports = router;
