const nodemailer = require("nodemailer")
const fs = require("fs")
const bufferToDataURI = require("buffer-to-data-url")
import bufferToDataUrl from "buffer-to-data-url"
import jsPDF from "jspdf"

export default async function sendTimesheet(req, res, next) {

    const { timesheet } = req.body

    const dateArr = timesheet && timesheet.days[0].date.split('-');
    const dateArrTwo = timesheet && timesheet.days[1].date.split('-');
    const dateArrThree = timesheet && timesheet.days[2].date.split('-');
    const dateArrFour = timesheet && timesheet.days[3].date.split('-');
    const dateArrFive = timesheet && timesheet.days[4].date.split('-');
    const newDate = `${dateArr[1]}-${dateArr[2]}-${dateArr[0]}`
    const newDateTwo = `${dateArrTwo[1]}-${dateArrTwo[2]}-${dateArrTwo[0]}`
    const newDateThree = `${dateArrThree[1]}-${dateArrThree[2]}-${dateArrThree[0]}`
    const newDateFour = `${dateArrFour[1]}-${dateArrFour[2]}-${dateArrFour[0]}`
    const newDateFive = `${dateArrFive[1]}-${dateArrFive[2]}-${dateArrFive[0]}`

    const doc = new jsPDF({
        orientation: "landscape",
    })

    let totalHrs = 0
    let author = ''
    if (timesheet && timesheet.days) {
        author = timesheet.author
        timesheet.days.map((day) => {
          if (day.totalHrs === "") {
            totalHrs += 0;
          } else {
            totalHrs += parseFloat(day.totalHrs);
          }
        });
      }

    doc.setFontSize(12)
    doc.text(`Name: ${author}`, 10, 10)
    doc.text(`Total Hours: ${totalHrs}`, 110, 10)
    doc.text(`Date Created: ${timesheet && timesheet.dateCreated || ''}`, 170, 10);

    doc.rect(5, 15, 260, 35, "S")
    doc.text(`Date: ${newDate}`, 10, 20)
    doc.text(`Monday: ${timesheet && timesheet.days[0].totalHrs} Hrs`, 70, 20)
    doc.text(`Jobsite: ${timesheet && timesheet.days[0].jobsite}`, 110, 20)
    doc.text(`Other Jobsite: ${timesheet && timesheet.days[0].additional} `, 170, 20)
    doc.text(`Start Time: ${timesheet && timesheet.days[0].startTime}`, 10, 30)
    doc.text(`Finish Time: ${timesheet && timesheet.days[0].finishTime}`, 70, 30)
    doc.text(`Foreman: ${timesheet && timesheet.days[0].foreman}`, 130, 30)
    const mondayText = `Description: ${timesheet && timesheet.days[0].description}`
    const mondayLines = doc.splitTextToSize(mondayText, 250)
    mondayLines.forEach((line, index) => {
        doc.text(line, 10, 40 + index * 7)
    })

    doc.rect(5, 55, 260, 35, "S")
    doc.text(`Date: ${newDateTwo}`, 10, 60)
    doc.text(`Tuesday: ${timesheet && timesheet.days[1].totalHrs} Hrs`, 70, 60)
    doc.text(`Jobsite: ${timesheet && timesheet.days[1].jobsite}`, 110, 60)
    doc.text(`Other Jobsite: ${timesheet && timesheet.days[1].additional} `, 170, 60)
    doc.text(`Start Time: ${timesheet && timesheet.days[1].startTime}`, 10, 70)
    doc.text(`Finish Time: ${timesheet && timesheet.days[1].finishTime}`, 70, 70)
    doc.text(`Foreman: ${timesheet && timesheet.days[1].foreman}`, 130, 70)
    const tuesdayText = `Description: ${timesheet && timesheet.days[1].description}`
    const tuesdayLines = doc.splitTextToSize(tuesdayText, 250)
    tuesdayLines.forEach((line, index) => {
        doc.text(line, 10, 80 + index * 7)
    })

    doc.rect(5, 95, 260, 35, "S")
    doc.text(`Date: ${newDateThree}`, 10, 100)
    doc.text(`Wednesday: ${timesheet && timesheet.days[2].totalHrs} Hrs`, 70, 100)
    doc.text(`Jobsite: ${timesheet && timesheet.days[2].jobsite}`, 110, 100)
    doc.text(`Other Jobsite: ${timesheet && timesheet.days[2].additional} `, 170, 100)
    doc.text(`Start Time: ${timesheet && timesheet.days[2].startTime}`, 10, 110)
    doc.text(`Finish Time: ${timesheet && timesheet.days[2].finishTime}`, 70, 110)
    doc.text(`Foreman: ${timesheet && timesheet.days[2].foreman}`, 130, 110)
    const wednesdayText = `Description: ${timesheet && timesheet.days[2].description}`
    const wednesdayLines = doc.splitTextToSize(wednesdayText, 250)
    wednesdayLines.forEach((line, index) => {
        doc.text(line, 10, 120 + index * 7)
    })

    doc.rect(5, 135, 260, 35, "S")
    doc.text(`Date: ${newDateFour}`, 10, 140)
    doc.text(`Thursday: ${timesheet && timesheet.days[3].totalHrs} Hrs`, 70, 140)
    doc.text(`Jobsite: ${timesheet && timesheet.days[3].jobsite}`, 110, 140)
    doc.text(`Other Jobsite: ${timesheet && timesheet.days[3].additional} `, 170, 140)
    doc.text(`Start Time: ${timesheet && timesheet.days[3].startTime}`, 10, 150)
    doc.text(`Finish Time: ${timesheet && timesheet.days[3].finishTime}`, 70, 150)
    doc.text(`Foreman: ${timesheet && timesheet.days[3].foreman}`, 130, 150)
    const thursdayText = `Description: ${timesheet && timesheet.days[3].description}`
    const thursdayLines = doc.splitTextToSize(thursdayText, 250)
    thursdayLines.forEach((line, index) => {
        doc.text(line, 10, 160 + index * 7)
    })

    doc.rect(5, 175, 260, 35, "S")
    doc.text(`Date: ${newDateFive}`, 10, 180)
    doc.text(`Friday: ${timesheet && timesheet.days[4].totalHrs} Hrs`, 70, 180)
    doc.text(`Jobsite: ${timesheet && timesheet.days[4].jobsite}`, 110, 180)
    doc.text(`Other Jobsite: ${timesheet && timesheet.days[4].additional} `, 170, 180)
    doc.text(`Start Time: ${timesheet && timesheet.days[4].startTime}`, 10, 190)
    doc.text(`Finish Time: ${timesheet && timesheet.days[4].finishTime}`, 70, 190)
    doc.text(`Foreman: ${timesheet && timesheet.days[4].foreman}`, 130, 190)
    const fridayText = `Description: ${timesheet && timesheet.days[4].description}`
    const fridayLines = doc.splitTextToSize(fridayText, 250)
    fridayLines.forEach((line, index) => {
        doc.text(line, 10, 200 + index * 7)
    })

    const pdfBuffer = doc.output("arraybuffer")
    const buffer = Buffer.from(pdfBuffer)

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
        subject: `${timesheet && timesheet.author} - ${timesheet && timesheet.days[0].date} Timesheet`,
        text: `${timesheet && timesheet.author} - ${timesheet && timesheet.days[0].date} Timesheet`,
        attachments: [
            {
                filename: `${timesheet && timesheet.author}${timesheet && timesheet.days[0].date}.pdf`,
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
