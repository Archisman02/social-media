const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  // console.log(req.cookies);
  // res.cookie("user_id", 25);

  // Post.find({}, function (err, posts) {
  //   return res.render("home", {
  //     title: "Codeial | Home",
  //     posts: posts,
  //   });
  // });

  try {
    // populate the user of each post
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        // populate: {
        //   path: "likes",
        // },
      })
      .populate("likes");

    if (req.user) {
      let friends = await User.findById(req.user.id).populate({
        path: "friendships",
        populate: {
          path: "to_user",
        },
      });

      // console.log(friends);

      let users = await User.find({});

      return res.render("home", {
        title: "Codeial | Home",
        posts: posts,
        all_friends: friends.friendships,
        all_users: users,
      });
    }

    let users = await User.find({});
    // console.log(users);

    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.log("Error", err);
    return;
  }
};
