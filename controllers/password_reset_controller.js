const User = require("../models/user");
const ResetPasswordToken = require("../models/resetPasswordToken");
const passwordResetMailer = require("../mailers/password_reset_mailer");
const crypto = require("crypto");

module.exports.resetPassword = async function (req, res) {
  //   let user = ResetPasswordToken.populate(["User"]);
  //   console.log(user);
  let user = await User.find({ email: req.body.checkEmail });

  if (user) {
    let token = await ResetPasswordToken.create({
      user: req.user,
      accessToken: crypto.randomBytes(20).toString("hex"),
      isValid: true,
    });

    //   comment = await comment.populate(["user"]);
    token = await token.populate(["user"]);

    console.log(token);

    // send mail
    passwordResetMailer.resetPassword(token);

    return res.render("password_reset", {
      token: token,
      title: "Password Change",
    });
  } else {
    console.log("Nooo");
  }
  //   return res.redirect("back");

  //   return res.redirect("back");
};

module.exports.checkPassword = async function (req, res) {
  // console.log(req.params.accessToken);
  if (req.body.password == req.body.confirmPassword) {
    let token = await ResetPasswordToken.find({
      accessToken: req.params.accessToken,
    });

    console.log(token[0]);
    // console.log(token.isValid);

    // token = await token.populate(["user"]);

    User.findByIdAndUpdate(
      token[0].user,
      {
        password: req.body.password,
      },
      function (err, user) {
        if (err) {
          console.log("Error in updating", err);
          return;
        }

        console.log(user.password);
      }
    );

    // let user = User.findById(token.user);
    // console.log(user._id);

    return res.redirect("/");
  }
};
