const nodemailer = require('nodemailer')
import jsPDF from 'jspdf';
import { sendEmail } from '@/custom/sendEmail';

export default async function sendIncidentReport (req, res, next) {

    const form = req.body

    const doc = new jsPDF();

    /////////////////////////////////////////////////////////
    
    doc.line(doc.internal.pageSize.getWidth() / 2, 15, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight())

    // IN CASE OF REQUIRED LOG

    doc.setFont(undefined, 'bold')
    doc.setFontSize(14)
    doc.text(`Booth Grading and Excavating: Incident Report Form`, 10, 10)
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')

    // PRIMARY INFORMATION SECTION

    doc.text(`Type of Incident: ${form.type}`, 10, 20)
    doc.text(`Date: ${form.date || 'N/A'}`, 10, 27)
    doc.text(`Time: ${form.time || 'N/A'}`, 40, 27)
    doc.text(`Name: ${form.name}`, 10, 34)
    doc.text(`Employee or Visitor? ${form.employeeType}`, 10, 41)
    doc.text(`Role: ${form.role}`, 10, 48)
    doc.text(`Supervisor: ${form.supervisor}`, 10, 55)
    doc.text(`Location: ${form.location}`, 10, 62)

    // OTHER INVOLVED INDIVIDUALS SECTION

    doc.setFont(undefined, 'bold')
    doc.text(`Other involved individuals:`, (doc.internal.pageSize.getWidth() / 2) + 10, 20)
    doc.setFont(undefined, 'normal')
    form.involved.forEach((employee, index) => {
        doc.text(`- ${`${employee.name} | ${employee.employeeOrVisitor} | ${employee.role}` || ''}`, (doc.internal.pageSize.getWidth() / 2) + 10, 25 + index * 5)
     })

    //  DESCRIPTION OF INCIDENT

    doc.setFont(undefined, 'bold')
    doc.text(`Description of Incident: `, 10, 77)
    doc.setFont(undefined, 'normal')
    const descriptionLines = doc.splitTextToSize(form.description, (doc.internal.pageSize.getWidth() / 2) - 10)
    descriptionLines.forEach((line, index) => {
        doc.text(line, 10, 84 + index * 5)
    })

    // WITNESSES

    doc.setFont(undefined, 'bold')
    doc.text("Witnesses:", (doc.internal.pageSize.getWidth() / 2) + 10, 77)
    doc.setFont(undefined, 'normal')
    doc.text(`${form.witnesses}`, (doc.internal.pageSize.getWidth() / 2) + 10, 84)

    doc.setFont(undefined, 'bold')
    doc.text(`Injuries/Losses: `, 10, 147)
    doc.setFont(undefined, 'normal')
    const injuriesLines = doc.splitTextToSize(form.injuriesOrLosses, (doc.internal.pageSize.getWidth() / 2) - 10)
    injuriesLines.forEach((line, index) => {
        doc.text(line, 10, 154 + index * 5)
    })

    // OTHER NOTES
    doc.setFont(undefined, 'bold')
    doc.text(`Other Notes: `, (doc.internal.pageSize.getWidth() / 2) + 10, 147)
    doc.setFont(undefined, 'normal')
    const otherNotesLines = doc.splitTextToSize(form.otherNotes, (doc.internal.pageSize.getWidth() / 2) - 20)
    otherNotesLines.forEach((line, index) => {
        doc.text(line, (doc.internal.pageSize.getWidth() / 2) + 10, 154 + index * 5)
    })

    // HOSPITALIZATION OR ENFROCEMENT CONTACT

    doc.text(`Hospitalization Required? ${form.hospitalRequired}`, 10, 204)
    doc.text(`Physician Required? ${form.physicianRequired}`, 10, 211)
    doc.text(`Facility Name: ${form.facilityName || 'N/A'}`, 10, 218)
    
    doc.text(`Law Enforcement Contact Required? ${form.enforcementRequired}`, 10, 228)
    const [year, month, day] = form.enforcementTime.split('T')[0].split('-')
    const time = form.enforcementTime.split('T')[1]
    doc.text( form.enforcementRequired === 'Yes' ? `Date and Time of Contact: ${month}-${day}-${year} at ${time}` : 'Date and Time of Contact: N/A', 10, 235)
    doc.text(`Law Enforcement Agency Name:`, 10, 242)
    doc.text(form.enforcementRequired === 'Yes' ? `- ${form.enforcementName}`: 'N/A', 10, 247)
    doc.text( form.enforcementRequired === 'Yes' ? `Report Number (if applicable): ${form.reportId}` : 'Report Number (if applicable): N/A', 10, 254)

    doc.text(`Submitted By: ${form.submittedBy}`, 10, doc.internal.pageSize.getHeight() - 10)


    /////////////////////////////////////////////////////////

    const pdfBuffer = doc.output("arraybuffer")
    const buffer = Buffer.from(pdfBuffer)

    
    const mailOptions = {
            from: "boothpaperwork@hotmail.com",
            to: "bgepayroll@gmail.com",
            subject: `Incident Report Form`,
            text: ``,
            attachments: [
                    {
                            filename: `Incident Report Form`,
                            content: buffer,
                            contentType: "application/pdf",
                        },
                    ],
                }
                
    sendEmail(mailOptions, req, res, next)
}