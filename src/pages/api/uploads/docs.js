import nodemailer from 'nodemailer';
import multer from 'multer';
import { sendEmail } from '@/custom/sendEmail';

const upload = multer({ storage: multer.memoryStorage() });

export default async function sendDocuments(req, res, next) {
  
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.log(err)
    } else {
      const file = req.file;
      const buffer = file.buffer;
      const filename = file.originalname;

    //   const transporter = nodemailer.createTransport({
    //     service: "hotmail",
    //     host: "smtp.office365.com",
    //     port: 587,
    //     secure: false,
    //     requireTLS: true,
    //     auth: {
    //         user: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
    //         pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
    //     }
    // })
      
    //   transporter.sendMail( {
    //     from: 'boothpaperwork@hotmail.com',
    //     to: 'davidsandoval596@gmail.com',
    //     subject: filename,
    //     text: '',
    //     attachments: [
    //       {
    //         filename: filename,
    //         content: buffer,
    //         contentType: 'application/pdf',
    //         encoding: 'base64'
    //       },
    //     ],
    //   }, (error, info) => {
    //     if (error) {
    //       console.error(error);
    //       res.status(500).send('Failed to send the email');
    //     } else {
    //       console.log('Email sent:', info.response);
    //       res.status(200).send('Email sent successfully');
    //     }
    //   })

    const attachments = [
      {
        filename: filename,
        content: buffer,
        contentType: 'application/pdf',
        encoding: 'base64'
      },
    ]
    
    sendEmail(filename, '', attachments, req, res, next)

    }
  });

  
}

  export const config = {
    api: {
       bodyParser: false
    },
 }
 