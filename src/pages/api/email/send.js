const nodemailer = require("nodemailer")
const fs = require("fs")
const bufferToDataURI = require("buffer-to-data-url")
import bufferToDataUrl from "buffer-to-data-url"
import jsPDF from "jspdf"

export default async function sendPDF(req, res, next) {
    const { daily, images } = req.body
    const doc = new jsPDF()
    doc.setFontSize(12)

    doc.text("Booth Grading and Excavating, Inc.", 10, 10)
    doc.text(`Daily Report`, 10, 15)
    doc.text(`Contractor: ${daily.contractor}`, 10, 25)
    doc.text(`Date: ${daily.date}`, 80, 25)
    doc.text(`Directed By: ${daily.superintendent}`, 10, 35)
    doc.text(`Project: ${daily.name}`, 80, 35)
    doc.text(`Foreman: ${daily.foreman}`, 10, 55)
    doc.text(`Submitted ${daily.dateCreated}`, 110, 55)
    doc.text(`Equipment on jobsite and hours used:`, 10, 65)
    doc.text(`${daily.equipmentDescription}`, 10, 70)
    doc.text(`Description for contract work performed:`, 10, 80)
    doc.text(`${daily.workDescription}`, 10, 85)

    doc.text(`Description of extra work performed:`, 10, 95)
    doc.text(`${daily.extraWorkDescription}`, 10, 100)

    doc.rect(7, 110, 180, 55)
    doc.text(`Number of employees in jobsite: ${parseInt(daily.employeesNo) + 1}`, 10, 115)
    doc.text(`Name: ${daily.foreman}`, 10, 125)
    doc.text(`Hours: ${daily.totalHours}`, 80, 125)
    doc.text(`Picked Up Diesel? ${daily.pickedUpDiesel}`, 110, 125)
    daily.employees.forEach((employee, index) => {
        doc.text(`Name: ${employee.name}`, 10, 130 + index * 5)
        doc.text(`Hours ${employee.hours}`, 80, 130 + index * 5)
    })

    doc.text(`Notes:`, 10, 175)
    doc.text(`${daily.notes}`, 10, 180)

    let pageWidth = doc.internal.pageSize.getWidth();
    let pageHeight = doc.internal.pageSize.getHeight();
    let margin = 10;
    let maxImageWidth = (pageWidth - margin * 2);
    let maxImageHeight = (pageHeight - margin * 3) / 2;
    
    doc.addPage();
    
    images.forEach((image, index) => {
      let x = margin;
      let y = margin;
      let width = maxImageWidth;
      let height = maxImageHeight;
    
      if (index !== 0 && index % 2 === 0) {
        doc.addPage();
      } else if (index !== 0) {
        y += maxImageHeight + margin; // Increase y-coordinate for odd images
      }
    
      doc.addImage(image, "JPEG", x, y, width, height);
    });

    const pdfBuffer = doc.output('arraybuffer');
    const buffer = Buffer.from(pdfBuffer);

  // Convert the buffer to a data URL
    const dataURI = bufferToDataUrl(pdfBuffer, 'application/pdf');

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
        subject: "PDF file",
        text: "Attached is the PDF file",
        attachments: [
          {
              filename: `${daily.date}${daily.name}.pdf`,
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

export const config = {
   api: {
      bodyParser: {
         sizeLimit: "100mb",
      },
   },
}
