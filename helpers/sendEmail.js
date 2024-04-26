require("dotenv").config();

function sendEmailTo(username, email, message) {
  const nodemailer = require("nodemailer");
  const nodemailerConfig = {
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.OUTLOOK_EMAIL,
      pass: process.env.OUTLOOK_PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(nodemailerConfig);

  const mailOptions = {
    from: "oanceakevin3@gmail.com",
    to: "kevinoancex69@gmail.com",
    subject: "Test",
    text: message || `Welcome ${username} , to DarkSide! We have cookies!`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = sendEmailTo;