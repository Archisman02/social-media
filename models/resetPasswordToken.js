const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    accessToken: {
      type: String,
    },
    isValid: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const ResetPasswordToken = mongoose.model("ResetPasswordToken", passwordSchema);
module.exports = ResetPasswordToken;
