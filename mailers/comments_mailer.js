const nodeMailer = require("../config/nodemailer");

// this is another way of exporting a method (instead of module.exports)
exports.newComment = (comment) => {
  let htmlString = nodeMailer.renderTemplate(
    {
      comment: comment,
    },
    "/comments/new_comment.ejs"
  );

  nodeMailer.transporter.sendMail(
    {
      from: "archisman.mukherjee02@gmail.com",
      to: comment.user.email,
      subject: "New Comment Published",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }

      // console.log("Message sent", info);
      return;
    }
  );
};
