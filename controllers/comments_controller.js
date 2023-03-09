const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comments_mailer");

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      req.flash("success", "Comment added!");

      post.comments.push(comment);
      post.save();

      // comment = await comment.populate("user", "name email").execPopulate();

      comment = await comment.populate(["user"]);
      // console.log(comment);

      commentsMailer.newComment(comment);

      res.redirect("/");
    }
  } catch (err) {
    console.log("Error", err);
    req.flash("error", "Comment cannot be added!");
    return res.redirect("back");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.user == req.user.id) {
      let postId = comment.post;

      comment.remove();

      req.flash("success", "Comment removed!");

      let post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      return res.redirect("back");
    } else {
      req.flash("error", "Comment cannot be removed!");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", "Comment cannot be removed!");
    return res.redirect("back");
  }
};
