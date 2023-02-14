const Post = require("../models/post");

module.exports.create = function (req, res) {
  // return res.send("<h1>Hi you can make a post!</h1>");
  Post.create(
    {
      content: req.body.content,
      user: req.user._id,
    },
    function (err, post) {
      if (err) {
        console.log("error in creating a post");
        return;
      }

      return res.redirect("back");
    }
  );
};
