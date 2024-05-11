const nodemailer = require('nodemailer');
const Jimp = require('jimp');
import { sendEmail } from '@/custom/sendEmail';

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

      const mailOptions = {
        from: 'boothpaperwork@hotmail.com',
        to: 'bgepayroll@gmail.com',
        subject: `${userObj.name} - Images`,
        text: '',
        attachments: jimpImages
      };

  sendEmail(mailOptions, req, res, next)

  }
export const config = {
    api: {
       bodyParser: {
          sizeLimit: "100mb",
       },
  },
 }
 