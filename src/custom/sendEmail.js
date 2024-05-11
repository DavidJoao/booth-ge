
const nodemailer = require('nodemailer');

export const sendEmail = ( mailOptions, req, res, next ) => {

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