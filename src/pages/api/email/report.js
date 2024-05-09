const nodemailer = require('nodemailer')
const Jobsite = require('../../../models/jobsite')
const Equipment = require('../../../models/equipment')
import jsPDF from "jspdf";

export default async function sendReport (req, res, next) {
    
    const form = req.body;

    const foundEquipment = await Equipment.findOne({ $expr: { $eq: [{$concat: ["$number", " ", "$name"]}, `${form?.equipment}` ]} });
    const foundJobsite = await Jobsite.findOne({ "equipment._id": foundEquipment?._id });
    const foundJobsiteAlt = await Jobsite.findOne({ "equipment": { $elemMatch: { "number": foundEquipment.number, "name": foundEquipment.name }} });

    const doc = new jsPDF();

    // PAGE TITLE
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('Booth Grading & Excavating Equipment Report', 10, 10);
    doc.setFont(undefined, 'normal');

    doc.setFillColor(230, 230, 230);
    doc.rect(0, 80, doc.internal.pageSize.getWidth(), 7, 'F');
    doc.rect(0, 50, doc.internal.pageSize.getWidth(), 7, 'F');
    doc.rect(0, 25, doc.internal.pageSize.getWidth(), 7, 'F');
    
    doc.text(`Report Submitted By: ${form.author}`, (doc.internal.pageSize.getWidth()/2) + 15, 10)
    doc.text(`Jobsite: ${foundJobsite?.address || foundJobsiteAlt?.address ||  'No Jobsite Assigned'}`, 10, 20)
    doc.text(`Date: ${form.date}`, (doc.internal.pageSize.getWidth()/2) + 15, 20);
    
    doc.setFont(undefined, 'bold');
    // CONTENT: EQUIPMENT NAME
    doc.text('Equipment Reported:', (doc.internal.pageSize.getWidth()/2)-20, 30);
    doc.setFont(undefined, 'normal');
    doc.text(`- ${form.equipment}`, 10, 40);
    
    // CONTENT: FOREMAN DESCRIPTION
    doc.setFont(undefined, 'bold');
    doc.text('Foreman Description:', (doc.internal.pageSize.getWidth()/2)-20, 55);
    doc.setFont(undefined, 'normal');
    const extraLines = doc.splitTextToSize(`- ${form.description || ""}`, doc.internal.pageSize.getWidth() - 20)
    let extrax = 10
    let extray = 60
    extraLines.forEach(line => {
       doc.text(line, extrax, extray)
       extray += 5
    })
    
    //CONTENT MECHANICS DESCRIPTION
    doc.setFont(undefined, 'bold');
    doc.text('Mechanic Description:', (doc.internal.pageSize.getWidth()/2)-20, 85);
    doc.setFont(undefined, 'normal');
    doc.line(0, 95, doc.internal.pageSize.getWidth(), 95)
    doc.line(0, 100, doc.internal.pageSize.getWidth(), 100)
    doc.line(0, 105, doc.internal.pageSize.getWidth(), 105)
    doc.line(0, 110, doc.internal.pageSize.getWidth(), 110)
    doc.line(0, 115, doc.internal.pageSize.getWidth(), 115)
    doc.line(0, 120, doc.internal.pageSize.getWidth(), 120)

    /// CHECKBOX AREA
    const size = 5;
    doc.text('Lights:', 10, 140)
    doc.rect(40, 135, size, size);
    doc.stroke();
    doc.text('Tires/Tracks:', 10, 147)
    doc.rect(40, 142, size, size);
    doc.stroke();
    doc.text('Bucket:', 10, 154)
    doc.rect(40, 149, size, size);
    doc.stroke();
    doc.text('Battery:', 10, 161)
    doc.rect(40, 156, size, size);
    doc.stroke();

    doc.text('Hydraulic Controls:', 55, 140)
    doc.rect(95, 135, size, size);
    doc.stroke();
    doc.text('Air Filter:', 55, 147)
    doc.rect(95, 142, size, size);
    doc.stroke();
    doc.text('Brakes:', 55, 154)
    doc.rect(95, 149, size, size);
    doc.stroke();
    doc.text('Backup Alarm:', 55, 161)
    doc.rect(95, 156, size, size);
    doc.stroke();

    doc.text('Belt:', 115, 140)
    doc.rect(155, 135, size, size);
    doc.stroke();
    doc.text('Leaks:', 115, 147)
    doc.rect(155, 142, size, size);
    doc.stroke();
    doc.text('Transmission:', 115, 154)
    doc.rect(155, 149, size, size);
    doc.stroke();
    doc.text('Hoses:', 115, 161)
    doc.rect(155, 156, size, size);
    doc.stroke();

    // FINAL FOOTER
    doc.text('Other (Specify): ___________________________________________________', 10, 180);

    // BUFFER CONVERSION

    const pdfBuffer = doc.output("arraybuffer")
    const buffer = Buffer.from(pdfBuffer)

    //NODEMAILER CONFIGURATION

    const transporter = nodemailer.createTransport({
        service: "hotmail",
        host: "outlook.office365.com",
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
        subject: `${form.author} - Report for ${form.equipment}`,
        text: ``,
        attachments: [
            {
                filename: `${form.author} - Report for ${form.equipment}.pdf`,
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