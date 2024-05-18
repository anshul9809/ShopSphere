const nodemailer = require("nodemailer");
const expressAsyncHandler = require("express-async-handler");

module.exports.sendMail = expressAsyncHandler(async (data, req, res)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure:true,
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        }
    });
        console.log("main info is ", data);
        const info = transporter.sendMail({
            from: "Hello 👻", // sender address
            to: data.to, // list of receivers
            subject: data.subject, // Subject line
            text: data.text, // plain text body
            html: data.htm, // html body
          });
        //   console.log("info is ", info);
          console.log("Message sent: %s", info.messageId);

});