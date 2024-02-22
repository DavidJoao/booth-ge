const nodemailer = require('nodemailer')
import jsPDF from 'jspdf';

export default async function sendWarning (req, res, next) {

    const form = req.body

    const doc = new jsPDF();

    /////////////////////////////////////////////////////////



    /////////////////////////////////////////////////////////

    const pdfBuffer = doc.output("arraybuffer")
    const buffer = Buffer.from(pdfBuffer)

    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: "boothpaperwork@hotmail.com",
            pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
        },
    })

    const mailOptions = {
        from: "boothpaperwork@hotmail.com",
        to: "davidsandoval596@gmail.com",
        subject: ``,
        text: ``,
        attachments: [
            {
                filename: ``,
                content: buffer,
                contentType: "application/pdf",
            },
        ],
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