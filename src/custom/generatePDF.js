import jsPDF from "jspdf"

const generatePDF = (daily, imagesLinks) => {
        const doc = new jsPDF()
        doc.setFontSize(12)

        doc.text('Booth Grading and Excavating, Inc.', 10, 10)
        doc.text(`Daily Report`, 10, 15)
        doc.text(`Contractor: ${daily.contractor}`, 10, 25)
        doc.text(`Date: ${daily.date}`, 80, 25)
        doc.text(`Directed By: ${daily.superintendent}`, 10, 35)
        doc.text(`Project: ${daily.name}`, 80, 35)
        doc.text(`Foreman: ${daily.foreman}`, 10, 55)
        doc.rect(7, 60, 180, 35)
        doc.text(`Equipment on jobsite and hours used:`, 10, 65)
        doc.text(`${daily.equipmentDescription}`, 10, 70)
        doc.text(`Description for work performed:`, 10, 80)
        doc.text(`${daily.workDescription}`, 10, 85)
        doc.rect(7, 110, 180, 60)
        doc.text(`Number of employees in jobsite: ${daily.employeesNo}`, 10, 115)
        daily.employees.forEach((employee, index) => {
            doc.text(`Name: ${employee.name}`, 10, 125 + (index * 5))
            doc.text(`Hours ${employee.hours}`, 80, 125 + (index * 5))
        })

        let yPos = 250; // starting y-position
        imagesLinks.forEach((image, index) => {
            const img = new Image();
            img.src = image;
            img.onload = () => {
              const pageWidth = doc.internal.pageSize.width - 10; // 10 is the margin
              const pageHeight = doc.internal.pageSize.height - 10; // 10 is the margin
              const widthScaleFactor = pageWidth / img.width;
              const heightScaleFactor = pageHeight / img.height;
              const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);
              const imgWidth = img.width * scaleFactor;
              const imgHeight = img.height * scaleFactor;
              if (yPos + imgHeight + 10 > doc.internal.pageSize.height) {
                doc.addPage();
                yPos = 10;
              }
              doc.addImage(image, 'JPEG', 5, yPos, imgWidth, imgHeight);
              yPos += imgHeight + 10; // increment the y-position
              if (index === imagesLinks.length - 1) {
                doc.save(`${daily.date}${daily.name}.pdf`);
              }
            };
          });
    // DOWNLOAD EVEN IF HAS NO IMAGES
    if (imagesLinks.length === 0) {
        doc.save(`${daily.date}${daily.name}.pdf`);
        return
        }
    }
    
    export default generatePDF