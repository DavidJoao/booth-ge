import nodemailer from 'nodemailer';

export default async function handler(req, res) {

  const arrayBuffer = req.body;
  const pdfBuffer = Buffer.from(arrayBuffer)

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'boothpaperwork@hotmail.com',
      pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'boothpaperwork@hotmail.com',
    to: 'davidsandoval596@gmail.com',
    subject: 'Paperwork',
    text: '',
    attachments: [
      {
        filename: 'test.pdf',
        content: pdfBuffer,
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

  export const config = {
    api: {
       bodyParser: {
          sizeLimit: "100mb",
       },
    },
 }
 