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
   doc.text(`Construction Daily Field Report`, 110, 10)
   doc.text(`Contractor: ${daily.contractor || ""}`, 10, 20)
   doc.text(`Date: ${daily.date || ""}`, 110, 20)
   doc.text(`Directed By: ${daily.superintendent || ""}`, 10, 30)
   doc.text(`Project: ${daily.name || ""}`, 110, 30)
   doc.text(`Foreman: ${daily.foreman || ""}`, 10, 45)
   doc.text(`Submitted ${daily.dateCreated || ""}`, 110, 45)
   doc.text(`Description for contract work performed:`, 10, 65)
   const workLines = doc.splitTextToSize(`- ${daily.workDescription || ""}`, 190)
   let workx = 10
   let worky = 70
   workLines.forEach(line => {
      doc.text(line, workx, worky)
      worky += 5
   })

   doc.text(`Description of extra work performed:`, 10, 90)
   const extraLines = doc.splitTextToSize(`- ${daily.workDescription || ""}`, 190)
   let extrax = 10
   let extray = 95
   extraLines.forEach(line => {
      doc.text(line, extrax, extray)
      extray += 5
   })

   doc.line(0, 105, doc.internal.pageSize.getWidth(), 105)
   doc.text(`Number of employees in jobsite: ${parseInt(daily.employeesNo) + 1}`, 10, 115)
   doc.text(`- ${daily.foreman || ""}`, 10, 125)
   doc.text(`Hrs: ${daily.totalHours || ""}`, 70, 125)
   doc.text(`Picked Up Diesel? ${daily.pickedUpDiesel === true ? 'Yes' : 'No'}`, 90, 125)
   daily.employees.forEach((employee, index) => {
      doc.text(`- ${employee.name || ""}`, 10, 130 + index * 5)
      doc.text(`Hrs ${employee.hours || ""}`, 70, 130 + index * 5)
   })

   doc.text(`Rented Employees: ${daily.rentedNo || ""}`, 150, 115)
   daily.rentedEmployees.forEach((employee, index) => {
      doc.text(`- ${employee.hours} Hrs`, 150, 125 + index * 5)
   })

   doc.line(0, 180, doc.internal.pageSize.getWidth(), 180)
   doc.text(`Equipment on Jobsite and hours used:`, 10, 190)
   daily.equipment.forEach((equipment, index) => {
      doc.text(`- ${equipment.name || ""}`, 10, 195 + index * 5)
      doc.text(`- ${equipment.hours || ""} Hrs`, 90, 195 + index * 5)
   })

   doc.line(0, 250, doc.internal.pageSize.getWidth(), 250)
   doc.text("Notes: ", 10, 260)
   const notesLines = doc.splitTextToSize(`- ${daily.notes || ""}`, 190)
   let notesx = 10
   let notesy = 265
   notesLines.forEach(line => {
      doc.text(line, notesx, notesy)
      notesy += 5
   })

   let pageWidth = doc.internal.pageSize.getWidth()
   let pageHeight = doc.internal.pageSize.getHeight()
   let margin = 10
   let maxImageWidth = pageWidth - margin * 2
   let maxImageHeight = (pageHeight - margin * 3) / 2

   doc.addPage()

   images.forEach((image, index) => {
      let x = margin
      let y = margin
      let width = maxImageWidth
      let height = maxImageHeight

      if (index !== 0 && index % 2 === 0) {
         doc.addPage()
      } else if (index !== 0) {
         y += maxImageHeight + margin // Increase y-coordinate for odd images
      }

      doc.addImage(image, "JPEG", x, y, width, height)
   })

   const pdfBuffer = doc.output("arraybuffer")
   const buffer = Buffer.from(pdfBuffer)

   // Convert the buffer to a data URL
   const dataURI = bufferToDataUrl(pdfBuffer, "application/pdf")

   const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
         user: "boothpaperwork@hotmail.com",
         pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
      },
   })

   const mailOptions = {
      from: "boothpaperwork@hotmail.com",
        to: "bgepayroll@gmail.com",
        subject: `${daily.date} Daily Report for ${daily.name}`,
        text: `${daily.date} - ${daily.name}`,
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
