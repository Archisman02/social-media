const nodeMailer = require("../config/nodemailer");

exports.resetPassword = (token) => {
  let htmlString = nodeMailer.renderTemplate(
    {
      token: token,
    },
    "/password/reset_password.ejs"
  );

  nodeMailer.transporter.sendMail(
    {
      from: "archisman.mukherjee02@gmail.com",
      to: token.user.email,
      subject: "Change Your Password",
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

// exports.newComment = (comment) => {
//   let htmlString = nodeMailer.renderTemplate(
//     {
//       comment: comment,
//     },
//     "/comments/new_comment.ejs"
//   );

//   nodeMailer.transporter.sendMail(
//     {
//       from: "archisman.mukherjee02@gmail.com",
//       to: comment.user.email,
//       subject: "New Comment Published",
//       html: htmlString,
//     },
//     (err, info) => {
//       if (err) {
//         console.log("Error in sending mail", err);
//         return;
//       }

//       // console.log("Message sent", info);
//       return;
//     }
//   );
// };
