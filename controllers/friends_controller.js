const User = require("../models/user");
const Friendship = require("../models/friendship");

module.exports.addFriend = async function (req, res) {
  try {
    if (req.user.id != req.params.id) {
      let user = await User.findById(req.user.id);

      let friend = await Friendship.create({
        from_user: req.user.id,
        to_user: req.params.id,
      });

      user.friendships.push(friend);
      user.save();

      return res.redirect("/");
    }
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};

module.exports.destroyFriend = async function (req, res) {
  try {
    if (req.user.id != req.params.id) {
      let friend = await Friendship.findOne({
        from_user: req.user.id,
        to_user: req.params.id,
      });
      console.log(friend);

      friend.remove();

      let friendRemove = await User.findOneAndUpdate(
        { from_user: req.user.id },
        {
          $pull: { friendships: req.params.id },
        }
      );

      return res.redirect("back");
    }
  } catch (err) {
    console.log("error", err);
    return res.redirect("back");
  }
};
