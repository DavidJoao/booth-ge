const nodemailer = require('nodemailer');
const Jimp = require('jimp');

export default async function sendImages (req, res, next) {

    const { images, userObj } = req.body;

    const jimpImages = await Promise.all(
        images.map(async (base64Images, index) => {
          
            const buffer = Buffer.from(base64Images.split(',')[1], 'base64');
            const image = await Jimp.read(buffer);

            image.scale(2)

            const processedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

            return {
                filename: `image${index}.jpeg`,
                content: processedImageBuffer
            };
        })
    )


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
        subject: `${userObj.name} - Images`,
        text: '',
        attachments: jimpImages
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
 