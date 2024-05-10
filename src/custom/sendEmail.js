
const nodemailer = require('nodemailer');

export const sendEmail = ( subject, text, attachments, req, res, next ) => {

    const transporter = nodemailer.createTransport({
        service: "hotmail",
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
            pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
        }
    })
  
     const mailOptions = {
        from: "boothpaperwork@hotmail.com",
          to: "bgepayroll@gmail.com",
          subject: subject,
          text: text,
          attachments: attachments
      }
  
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error)
            res.status(500).end("Failed to send the email")
        } else {
            console.log("Email sent:", info.response)
            res.status(200).end("Email sent successfully")
        }
    })


}