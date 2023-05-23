import jsPDF from "jspdf"

const generatePDF = (daily) => {
   const dateArr = daily.date.split('-');
   const newDate = `${dateArr[1]}-${dateArr[2]}-${dateArr[0]}`

   const doc = new jsPDF()
   doc.setFontSize(12)

   doc.text("Booth Grading and Excavating, Inc.", 10, 10)
   doc.text(`Construction Daily Field Report`, 110, 10)
   doc.text(`Contractor: ${daily.contractor  || ''}`, 10, 20)
   doc.text(`Date: ${newDate  || ''}`, 110, 20)
   doc.text(`Directed By: ${daily.superintendent  || ''}`, 10, 30)
   doc.text(`Project: ${daily.name  || ''}`, 110, 30)
   doc.text(`Foreman: ${daily.foreman  || ''}`, 10, 45)
   doc.text(`Submitted ${daily.dateCreated  || ''}`, 110, 45)
   doc.text(`Description for contract work performed:`, 10, 65)
   const workLines = doc.splitTextToSize(`- ${daily.workDescription || ''}`, 190)
   let workx = 10;
   let worky = 70;
   workLines.forEach(line => {
      doc.text(line, workx, worky)
      worky += 5; 
   })

   doc.text(`Description of extra work performed:`, 10, 90)
   const extraLines = doc.splitTextToSize(`- ${daily.workDescription || ''}`, 190)
   let extrax = 10;
   let extray = 95;
   extraLines.forEach(line => {
      doc.text(line, extrax, extray)
      extray += 5; 
   })

   const extraHalf = daily && daily.pickedUpDiesel ? '.5' : ''
   doc.line(0, 105, doc.internal.pageSize.getWidth(), 105)
   doc.text(`Number of employees in jobsite: ${parseInt(daily.employeesNo) + 1}`, 10, 115)
   doc.text(`- ${daily.foreman  || ''}`, 10, 125)
   doc.text(`Hrs: ${daily.totalHours || ''}${extraHalf}`, 70, 125)
   doc.text(`Picked Up Diesel? ${daily && daily.pickedUpDiesel ? 'Yes' : 'No'}`, 90, 125)
   daily.employees.forEach((employee, index) => {
      doc.text(`- ${employee.name  || ''}`, 10, 130 + index * 5)
      doc.text(`Hrs ${employee.hours  || ''}`, 70, 130 + index * 5)
   })

   doc.text(`Rented Employees: ${daily.rentedNo  || ''}`, 150, 115)
   daily.rentedEmployees.forEach((employee, index) => {
      doc.text(`- ${employee.hours} Hrs`, 150, 125 + index * 5)
   })

   doc.line(0, 180, doc.internal.pageSize.getWidth(), 180)
   doc.text(`Equipment on Jobsite and hours used:`, 10, 190)
   daily.equipment.forEach((equipment, index) => {
      doc.text(`- ${equipment.name || ''}`, 10, 195 + index * 5)
      doc.text(`- ${equipment.hours || ''} Hrs`, 90, 195 + index * 5 )
   })

   doc.line(0, 250, doc.internal.pageSize.getWidth(), 250)
   doc.text('Notes: ', 10, 260)
   const notesLines = doc.splitTextToSize(`- ${daily.notes || ''}`, 190)
   let notesx = 10;
   let notesy = 265;
   notesLines.forEach(line => {
      doc.text(line, notesx, notesy)
      notesy += 5; 
   })

   doc.save(`${daily.date}${daily.name}.pdf`)
}

export default generatePDF
