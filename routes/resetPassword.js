const express = require("express");
const router = express.Router();

const resetPasswordController = require("../controllers/password_reset_controller");

router.get("/", resetPasswordController.resetPassword);
router.post("/:accessToken", resetPasswordController.checkPassword);

module.exports = router;
