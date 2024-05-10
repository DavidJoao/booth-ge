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
    const dateArrSix = timesheet && timesheet.days[5].date.split('-');
    const newDate = `${dateArr[1]}-${dateArr[2]}-${dateArr[0]}`
    const newDateTwo = `${dateArrTwo[1]}-${dateArrTwo[2]}-${dateArrTwo[0]}`
    const newDateThree = `${dateArrThree[1]}-${dateArrThree[2]}-${dateArrThree[0]}`
    const newDateFour = `${dateArrFour[1]}-${dateArrFour[2]}-${dateArrFour[0]}`
    const newDateFive = `${dateArrFive[1]}-${dateArrFive[2]}-${dateArrFive[0]}`
    const newDateSix = `${dateArrSix[1]}-${dateArrSix[2]}-${dateArrSix[0]}`

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

    const finishTimes = [];

    if (timesheet && timesheet.days) {
      for (let i = 0; i < timesheet.days.length; i++) {
        const finishTime = timesheet.days[i].finishTime;
        const formattedFinishTime = new Date(`2000-01-01T${finishTime}`).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true });
        finishTimes.push(formattedFinishTime);
      }
    }

    doc.line(0, 39, doc.internal.pageSize.getWidth(), 39)
    doc.line(0, 78, doc.internal.pageSize.getWidth(), 78)
    doc.line(0, 112, doc.internal.pageSize.getWidth(), 112)
    doc.line(0, 146, doc.internal.pageSize.getWidth(), 146)
    doc.line(0, 175, doc.internal.pageSize.getWidth(), 175)
    doc.line(0, 6, doc.internal.pageSize.getWidth(), 6)

    doc.setFontSize(12)
    doc.text(`Name: ${author}`, 5, 5)
    doc.text(`Total Hours: ${totalHrs}`, 115, 5)
    doc.text(`Date Created: ${timesheet && timesheet.dateCreated || ''}`, 190, 5);
    doc.setFontSize(10);

    doc.text(`Date: ${newDate}`, 10, 10)
    doc.text(`Monday: ${timesheet && timesheet.days[0].totalHrs} Hrs`, 70, 10)
    doc.text(`Jobsite: ${timesheet && timesheet.days[0].jobsite}`, 115, 10)
    doc.text(`Other Jobsite: ${timesheet && timesheet.days[0].additional} `, 190, 10)
    doc.text(`Start Time: ${timesheet && timesheet.days[0].startTime} AM`, 10, 15)
    doc.text(`Finish Time: ${finishTimes[0] || ''}`, 70, 15)
    doc.text(`Foreman: ${timesheet && timesheet.days[0].foreman}`, 130, 15)
    const mondayText = `Description: ${timesheet && timesheet.days[0].description}`
    const mondayLines = doc.splitTextToSize(mondayText, 250)
    mondayLines.forEach((line, index) => {
        doc.text(line, 10, 20 + index * 4)
    })

    doc.text(`Date: ${newDateTwo}`, 10, 43)
    doc.text(`Tuesday: ${timesheet && timesheet.days[1].totalHrs} Hrs`, 70, 43)
    doc.text(`Jobsite: ${timesheet && timesheet.days[1].jobsite}`, 115, 43)
    doc.text(`Other Jobsite: ${timesheet && timesheet.days[1].additional} `, 190, 43)
    doc.text(`Start Time: ${timesheet && timesheet.days[1].startTime} AM`, 10, 48)
    doc.text(`Finish Time: ${finishTimes[1] || ''}`, 70, 48)
    doc.text(`Foreman: ${timesheet && timesheet.days[1].foreman}`, 130, 48)
    const tuesdayText = `Description: ${timesheet && timesheet.days[1].description}`
    const tuesdayLines = doc.splitTextToSize(tuesdayText, 250)
    tuesdayLines.forEach((line, index) => {
        doc.text(line, 10, 58 + index * 4)
    })

    doc.text(`Date: ${newDateThree}`, 10, 82)
    doc.text(`Wednesday: ${timesheet && timesheet.days[2].totalHrs} Hrs`, 70, 82)
    doc.text(`Jobsite: ${timesheet && timesheet.days[2].jobsite}`, 115, 82)
    doc.text(`Other Jobsite: ${timesheet && timesheet.days[2].additional} `, 190, 82)
    doc.text(`Start Time: ${timesheet && timesheet.days[2].startTime} AM`, 10, 87)
    doc.text(`Finish Time: ${finishTimes[2] || ''}`, 70, 87)
    doc.text(`Foreman: ${timesheet && timesheet.days[2].foreman}`, 130, 87)
    const wednesdayText = `Description: ${timesheet && timesheet.days[2].description}`
    const wednesdayLines = doc.splitTextToSize(wednesdayText, 250)
    wednesdayLines.forEach((line, index) => {
        doc.text(line, 10, 97 + index * 4)
    })

    doc.text(`Date: ${newDateFour}`, 10, 116)
    doc.text(`Thursday: ${timesheet && timesheet.days[3].totalHrs} Hrs`, 70, 116)
    doc.text(`Jobsite: ${timesheet && timesheet.days[3].jobsite}`, 115, 116)
    doc.text(`Other Jobsite: ${timesheet && timesheet.days[3].additional}`, 190, 116)
    doc.text(`Start Time: ${timesheet && timesheet.days[3].startTime} AM`, 10, 121)
    doc.text(`Finish Time: ${finishTimes[3] || ''}`, 70, 121)
    doc.text(`Foreman: ${timesheet && timesheet.days[3].foreman}`, 130, 121)
    const thursdayText = `Description: ${timesheet && timesheet.days[3].description}`
    const thursdayLines = doc.splitTextToSize(thursdayText, 250)
    thursdayLines.forEach((line, index) => {
        doc.text(line, 10, 131 + index * 4)
    })

    doc.text(`Date: ${newDateFive}`, 10, 150)
    doc.text(`Friday: ${timesheet && timesheet.days[4].totalHrs} Hrs`, 70, 150)
    doc.text(`Jobsite: ${timesheet && timesheet.days[4].jobsite}`, 115, 150)
    doc.text(`Other Jobsite: ${timesheet && timesheet.days[4].additional} `, 190, 150)
    doc.text(`Start Time: ${timesheet && timesheet.days[4].startTime} AM`, 10, 155)
    doc.text(`Finish Time: ${finishTimes[4] || ''}`, 70, 155)
    doc.text(`Foreman: ${timesheet && timesheet.days[4].foreman}`, 130, 155)
    const fridayText = `Description: ${timesheet && timesheet.days[4].description}`
    const fridayLines = doc.splitTextToSize(fridayText, 250)
    fridayLines.forEach((line, index) => {
        doc.text(line, 10, 165 + index * 4)
    })

    doc.text(`Date: ${newDateSix}`, 10, 180)
    doc.text(`Saturday: ${timesheet && timesheet.days[5].totalHrs} Hrs`, 70, 180)
    doc.text(`Jobsite: ${timesheet && timesheet.days[5].jobsite}`, 115, 180)
    doc.text(`Other Jobsite: ${timesheet && timesheet.days[5].additional} `, 190, 180)
    doc.text(`Start Time: ${timesheet && timesheet.days[5].startTime} AM`, 10, 185)
    doc.text(`Finish Time: ${finishTimes[5] || ''}`, 70, 185)
    doc.text(`Foreman: ${timesheet && timesheet.days[5].foreman}`, 130, 185)
    const satText = `Description: ${timesheet && timesheet.days[5].description}`
    const satLines = doc.splitTextToSize(satText, 250)
    satLines.forEach((line, index) => {
        doc.text(line, 10, 195 + index * 4)
    })

    const pdfBuffer = doc.output("arraybuffer")
    const buffer = await Buffer.from(pdfBuffer)

    const dataURI = bufferToDataUrl(pdfBuffer, "application/pdf")


    const transporter = nodemailer.createTransport({
        service: "hotmail",
        host: "smtp.office365.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
            pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
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
