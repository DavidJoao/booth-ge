const nodemailer = require('nodemailer')
import jsPDF from 'jspdf';

export default async function (req, res, next) {

    const form = req.body

    const doc = new jsPDF();

    const fromArr = form.from.split('-');
    const newFrom = `${fromArr[1]}-${fromArr[2]}-${fromArr[0]}`
    const toArr = form.to.split('-');
    const newTo = `${toArr[1]}-${toArr[2]}-${toArr[0]}`

    doc.setFont(undefined, 'bold');
    doc.setFontSize(14)
    doc.text('Booth Grading & Excavating, Inc.', 130, 10);
    doc.setFontSize(12)
    doc.text('Absence Request', 10, 20);
    doc.setFont(undefined, 'normal');

    doc.setFillColor(150, 150, 150);
    doc.rect(10, 25, doc.internal.pageSize.getWidth() - 20, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.text('Absence Information', doc.internal.pageSize.getWidth()/2 - 30, 30)
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);

    doc.text(`Employee Name: ${form.name}`, 10, 40);
    doc.text(`Foreman: ${form.foreman}`, 10, 50);
    doc.text(`Type of Absence Requested: ${form.type}`, 10, 60);

    doc.text(`From: ${newFrom}`, 10, 70);
    doc.text(`To: ${newTo}`, doc.internal.pageSize.getWidth()/2 - 30, 70);
    doc.text(`Total Hours: ${form.totalHours}`, 150, 70);
    doc.text(`Reason for Absence:`, 10, 85);
    doc.text(`${form.reason}`, 10, 90)
    const extraLines = doc.splitTextToSize(`${form.reason || ""}`, doc.internal.pageSize.getWidth() - 20)
    let extrax = 10
    let extray = 90
    extraLines.forEach(line => {
       doc.text(line, extrax, extray)
       extray += 5
    })

    doc.setFont('Helvetica', 'italic');
    const extraLiness = doc.splitTextToSize(`You must submit requests for absences, other than sick leave, two days prior to the first day you will be absent.`, doc.internal.pageSize.getWidth() - 20)
    let extraxx = 10
    let extrayy = 110
    extraLiness.forEach(line => {
       doc.text(line, extraxx, extrayy)
       extrayy += 5
    })
    doc.setFont(undefined, 'normal');
    doc.text(`Date: ${form.date}`, 10, 120);

    doc.setFillColor(150, 150, 150);
    doc.rect(10, 125, doc.internal.pageSize.getWidth() - 20, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.text('Manager Approval', doc.internal.pageSize.getWidth()/2 - 30, 130)
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);

    const size = 5;

    doc.text(`Approved`, 20, 140);
    doc.rect(10, 136, size, size);
    doc.stroke();
    doc.text(`Rejected`, 20, 150);
    doc.rect(10, 146, size, size);
    doc.stroke();
    doc.text(`Comments: `, 10, 165)

    doc.line(10, 210, doc.internal.pageSize.getWidth() - 20, 210)
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(10)
    doc.text(`Manager Signature: `, 10, 215)
    doc.text(`Date: `, 150, 215)


    const pdfBuffer = doc.output("arraybuffer")
    const buffer = Buffer.from(pdfBuffer)

    const transporter = nodemailer.createTransport({
        service: "hotmail",
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
            user: "boothpaperwork@hotmail.com",
            pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
        },
        tls: {
            ciphers:'SSLv3'
        }
    })

    const mailOptions = {
        from: "boothpaperwork@hotmail.com",
        to: "bgepayroll@gmail.com",
        subject: `${form.name} - Absence Request Form`,
        text: ``,
        attachments: [
            {
                filename: `${form.name} - Absence Request Form.pdf`,
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