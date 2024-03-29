import nodemailer from 'nodemailer';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export default async function sendDocuments(req, res) {
  
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.log(err)
    } else {
      const file = req.file;
      const buffer = file.buffer;
      const filename = file.originalname;

      const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'boothpaperwork@hotmail.com',
          pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
        },
      });
      
      const mailOptions = {
        from: 'boothpaperwork@hotmail.com',
        to: 'bgepayroll@gmail.com',
        subject: filename,
        text: '',
        attachments: [
          {
            filename: filename,
            content: buffer,
            contentType: 'application/pdf',
            encoding: 'base64'
          },
        ],
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send('Failed to send the email');
        } else {
          console.log('Email sent:', info.response);
          res.status(200).send('Email sent successfully');
        }
      })
    }
  });
}

  export const config = {
    api: {
       bodyParser: false
    },
 }
 