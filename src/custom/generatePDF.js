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
        doc.text(`Submitted ${daily.dateCreated}`, 110, 55)
        doc.text(`Equipment on jobsite and hours used:`, 10, 65)
        doc.text(`${daily.equipmentDescription}`, 10, 70)
        doc.text(`Description for contract work performed:`, 10, 80)
        doc.text(`${daily.workDescription}`, 10, 85)

        doc.text(`Description of extra work performed:`, 10, 95)
        doc.text(`${daily.extraWorkDescription}`, 10, 100)

        doc.rect(7, 110, 180, 55)
        doc.text(`Number of employees in jobsite: ${parseInt(daily.employeesNo) + 1}`, 10, 115)
        doc.text(`Name: ${daily.foreman}`, 10, 125)
        doc.text(`Hours: ${daily.totalHours}`, 80, 125)
        doc.text(`Picked Up Diesel? ${daily.pickedUpDiesel}`, 110, 125)
        daily.employees.forEach((employee, index) => {
            doc.text(`Name: ${employee.name}`, 10, 130 + (index * 5))
            doc.text(`Hours ${employee.hours}`, 80, 130 + (index * 5))
        })


        doc.text(`Notes:`, 10, 175)
        doc.text(`${daily.notes}`, 10, 180)


        let yPos = doc.internal.pageSize.height; // starting y-position
        const margin = 10;
        const pageWidth = doc.internal.pageSize.width - margin * 2; // 10 is the margin
        const pageHeight = doc.internal.pageSize.height - margin * 2; // 10 is the margin
        const maxImagesPerPage = 2;
        let imagesPerPage = 0;
        
        imagesLinks.forEach((image, index) => {
            const img = new Image();
            img.src = image;
            img.onload = () => {
                const widthScaleFactor = pageWidth / img.width;
                const heightScaleFactor = (doc.internal.pageSize.height / 2 - margin * 3) / img.height;
                const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);
                const imgWidth = img.width * scaleFactor;
                const imgHeight = doc.internal.pageSize.height / 2 - margin * 3;
        
                if (index === 0) {
                    doc.addPage();
                    yPos = doc.internal.pageSize.height;
                    imagesPerPage = 0;
                }
        
                if (yPos - imgHeight - margin < margin) {
                    doc.addPage();
                    yPos = doc.internal.pageSize.height;
                    imagesPerPage = 0;
                }
        
                if (imagesPerPage === maxImagesPerPage) {
                    doc.addPage();
                    yPos = doc.internal.pageSize.height;
                    imagesPerPage = 0;
                }
        
                doc.addImage(image, 'JPEG', margin, yPos - imgHeight - margin, imgWidth, imgHeight);
                yPos -= imgHeight + margin * 2; // increment the y-position
                imagesPerPage++;
        
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