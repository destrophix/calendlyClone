const nodemailer = require("nodemailer");
const bigPromise = require("../middlewares/bigPromise");

const mailHelpter = bigPromise(async (option) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  let transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: SMTP_USER, // generated ethereal user
      pass: SMTP_PASS, // generated ethereal password
    },
  });

  let msg = {
    from: "calendlyclone@gmail.com", // sender address
    to: option.email, // list of receivers
    subject: option.subject, // Subject line
    text: option.msg, // plain text body
  };

  await transporter.sendMail(msg);
});

module.exports = mailHelpter;
