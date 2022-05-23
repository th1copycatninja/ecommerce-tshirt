const nodemailer = require("nodemailer");

const mailHelper = async (options) =>{
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER, // generated ethereal user
          pass: process.env.MAIL_PASS, // generated ethereal password
        },
      });

         await transporter.sendMail({
        from: 'uic.17mca8067@gmail.com', // sender address
        to: options.toMail, // list of receivers
        subject: "forgot password mail", // Subject line
        text: "forgot password mail send using nodemailer and mailtrap", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
}

module.exports = mailHelper;