const nodemailer = require('nodemailer')
import jsPDF from 'jspdf'
import { sendEmail } from '@/custom/sendEmail';

export default async function emailMeeting(req, res, next){

    const signForm = req.body;

    const doc = new jsPDF();

    doc.setFont(undefined, 'bold');
    doc.setFontSize(14)

    doc.text(`${signForm?.title}`, 10, 10);
    doc.text(`Date: ${signForm?.date}`, 10, 30);
    doc.text(`Jobsite Location: ${signForm?.jobsite}`, 10, 40);
    doc.text(`Booth Grading Employees Attending:`, 10, 60); 

    doc.setFont(undefined, 'normal')
    doc.setFontSize(12)

    let x = 10;
    let y = 80;

    for (let i = 0; i < signForm?.employees.length; i++) {
        const employee = signForm?.employees[i];
        const employeeName = employee.name;
      
        doc.text(employeeName, x, y);
        doc.line(x, y + 2, x + 70, y + 2);
      
        // Calculate the next coordinates
        if (i % 2 === 0) {
          x = 100;
        } else {
          x = 10;
          y += 20;
        }
      }

    doc.setFont(undefined, 'bold');
    doc.setFontSize(14)
    doc.text(`Rental Laborers Attending: `, 10, 230);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(12)

    let rentalX = 10;
    let rentalY = 240;

    for (let i = 0; i < signForm?.rentedEmployees.length; i++) {
        const employee = signForm?.rentedEmployees[i];
        const employeeName = employee.name;
      
        doc.text(employeeName, rentalX, rentalY);
        doc.line(rentalX, rentalY + 2, rentalX + 70, rentalY + 2);
      
        // Calculate the next coordinates
        if (i % 2 === 0) {
          rentalX = 100;
        } else {
          rentalX = 10;
          rentalY += 20;
        }
      }


    const pdfBuffer = doc.output("arraybuffer")
    const buffer = Buffer.from(pdfBuffer)

    const mailOptions = {
        from: "boothpaperwork@hotmail.com",
        to: "bgepayroll@gmail.com",
        subject: `${signForm?.jobsite} - ${signForm?.title} Signatures`,
        text: ``,
        attachments: [
            {
                filename: `${signForm?.jobsite} - ${signForm?.title} Signatures`,
                content: buffer,
                contentType: "application/pdf",
            },
        ],
    }

  sendEmail(mailOptions, req, res, next)

}