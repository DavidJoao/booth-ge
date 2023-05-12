const nodemailer = require('nodemailer')

export default async function sendPDF (req, res, next) {
    
    const pdfData = req.body;

    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'boothpaperwork@hotmail.com',
          pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD
        }
      });

    const mailOptions = {
      from: 'boothpaperwork@hotmail.com',
      to: 'davidsandoval596@gmail.com',
      subject: 'PDF file',
      text: 'Attached is the PDF file',
      attachments: [
        {
          filename: 'document.pdf',
          content: pdfData, 
          contentType: 'application/pdf'
        }
      ]
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).end('Failed to send the email');
        } else {
          console.log('Email sent:', info.response);
          res.status(200).end('Email sent successfully');
        }
      })
}