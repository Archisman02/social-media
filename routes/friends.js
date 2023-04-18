const express = require("express");
const router = express.Router();

const friendsController = require("../controllers/friends_controller");

router.post("/create/:id", friendsController.addFriend);
router.post("/remove/:id", friendsController.destroyFriend);

module.exports = router;
