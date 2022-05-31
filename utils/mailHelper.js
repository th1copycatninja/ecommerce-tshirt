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
        subject: options.subject, // Subject line
        text:options.message, // Messageplain text body
      });
}

module.exports = mailHelper;