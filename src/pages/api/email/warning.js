const nodemailer = require('nodemailer')
import jsPDF from 'jspdf';
import { sendEmail } from '@/custom/sendEmail';

export default async function sendWarning (req, res, next) {

    const form = req.body

    const doc = new jsPDF();

    /////////////////////////////////////////////////////////

    doc.setFont(undefined, 'bold');
    doc.setFontSize(14)
    doc.text(`Booth Grading and Excavating`, 10, 10)
    doc.text(`Employee Discipline Form`, 10, 20)
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')

    doc.setFillColor(150, 150, 150);
    doc.rect(10, 25, doc.internal.pageSize.getWidth() - 20, 10, 'F');

    doc.text(`Employee Name: ${form?.employee}`, 10, 45)
    doc.text(`Date: ${form?.date}`, doc.internal.pageSize.getWidth() / 2, 45)

    doc.setFont(undefined, 'bold');
    doc.setFontSize(14)
    doc.text("Violation(s): ", 10, 60)
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`-${form?.type === 'Written' ? `${form?.violations}` : 'Verbal Warning; Read description below'}`, 10, 65)

    doc.setFont(undefined, 'bold');
    doc.setFontSize(14)
    doc.text("Description of Violation(s): ", 10, 75)
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`-${form?.description}`, 10, 80)

    doc.text("Further misconduct or violation(s) will result in disciplinary action, up to and including immediate termination.", 10, 120)
    doc.text("I have read this Warning Notice and understand it.", 10, 125)

    doc.text("Employee's Signature: _______________________________     Date:_____________", 10, 135)
    doc.text("Supervisor's Signature: ______________________________     Date:_____________", 10, 145)

    doc.text(`Submitted By: ${form.submittedBy}`, 10, 155)

    /////////////////////////////////////////////////////////

    const pdfBuffer = doc.output("arraybuffer")
    const buffer = Buffer.from(pdfBuffer)

    const mailOptions = {
        from: "boothpaperwork@hotmail.com",
        to: "bgepayroll@gmail.com",
        subject: `Warning for ${form.employee} submitted by ${form.submittedBy}`,
        text: ``,
        attachments: [
            {
                filename: `Warning for ${form.employee} submitted by ${form.submittedBy}`,
                content: buffer,
                contentType: "application/pdf",
            },
        ],
    }
    
    sendEmail(mailOptions, req, res, next)
}