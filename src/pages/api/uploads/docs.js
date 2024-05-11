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
        }
    
    sendEmail(mailOptions, req, res, next)

    }
  });

  
}

  export const config = {
    api: {
       bodyParser: false
    },
 }
 