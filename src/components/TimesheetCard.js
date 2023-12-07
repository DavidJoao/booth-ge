import axios from "@/custom/axios"
import React from "react"
import { Carousel } from "react-bootstrap"
import { jsPDF } from "jspdf"

const TimesheetCard = ({ timesheet, loadAll, auth }) => {
    const printIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
            />
        </svg>
    )
    const mailIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
        </svg>
    )

    const oneArr = timesheet.days[0].date.split("-")
    const oneDate = `${oneArr[1]}-${oneArr[2]}-${oneArr[0]}`
    const twoArr = timesheet.days[1].date.split("-")
    const twoDate = `${twoArr[1]}-${twoArr[2]}-${twoArr[0]}`
    const threeArr = timesheet.days[2].date.split("-")
    const threeDate = `${threeArr[1]}-${threeArr[2]}-${threeArr[0]}`
    const fourArr = timesheet.days[3].date.split("-")
    const fourDate = `${fourArr[1]}-${fourArr[2]}-${fourArr[0]}`
    const fiveArr = timesheet.days[4].date.split("-")
    const fiveDate = `${fiveArr[1]}-${fiveArr[2]}-${fiveArr[0]}`
    let sixArr;
    let sixDate;

    // const sixArr = timesheet.days[5].date.split("-");
    // const sixDate = `${sixArr[1]}-${sixArr[2]}-${sixArr[0]}`

    if (timesheet.days[5]) {
        sixArr = timesheet.days[5].date.split("-");
        sixDate = `${sixArr[1]}-${sixArr[2]}-${sixArr[0]}`
    }

    const handleDelete = e => {
        e.preventDefault()
        axios.delete(`/api/timesheet/delete/${timesheet._id}`).then(() => loadAll())
    }

    const generatePDF = e => {
        const doc = new jsPDF({
            orientation: "landscape",
        })

        doc.line(0, 39, doc.internal.pageSize.getWidth(), 39)
        doc.line(0, 78, doc.internal.pageSize.getWidth(), 78)
        doc.line(0, 112, doc.internal.pageSize.getWidth(), 112)
        doc.line(0, 146, doc.internal.pageSize.getWidth(), 146)
        doc.line(0, 175, doc.internal.pageSize.getWidth(), 175)
        doc.line(0, 6, doc.internal.pageSize.getWidth(), 6)

        let totalHrs = 0
        timesheet.days.map(day => {
            if (day.totalHrs === "") {
                totalHrs += 0
            } else {
                totalHrs += parseFloat(day.totalHrs)
            }
        })

        const finishTimes = []

        if (timesheet && timesheet.days) {
            for (let i = 0; i < timesheet.days.length; i++) {
                const finishTime = timesheet.days[i].finishTime
                const formattedFinishTime = new Date(`2000-01-01T${finishTime}`).toLocaleTimeString(
                [],
                { hour: "numeric", minute: "numeric", hour12: true }
                )
                finishTimes.push(formattedFinishTime)
            }
        }

        doc.setFontSize(12)
        doc.text(`Name: ${timesheet.author}`, 5, 5)
        doc.text(`Total Hours: ${totalHrs}`, 115, 5)
        doc.text(`Date Created: ${timesheet.dateCreated || ""}`, 190, 5)
        doc.setFontSize(10)

        doc.text(`Date: ${oneDate}`, 10, 10)
        doc.text(`Monday: ${timesheet.days[0].totalHrs} Hrs`, 70, 10)
        doc.text(`Jobsite: ${timesheet.days[0].jobsite}`, 115, 10)
        doc.text(`Other Jobsite: ${timesheet.days[0].additional} `, 190, 10)
        doc.text(`Start Time: ${timesheet.days[0].startTime}`, 10, 15)
        doc.text(`Finish Time: ${finishTimes[0] || ''}`, 70, 15)
        doc.text(`Foreman: ${timesheet.days[0].foreman}`, 130, 15)
        const mondayText = `Description: ${timesheet.days[0].description}`
        const mondayLines = doc.splitTextToSize(mondayText, 250)
        mondayLines.forEach((line, index) => {
            doc.text(line, 10, 20 + index * 4)
        })

        doc.text(`Date: ${twoDate}`, 10, 43)
        doc.text(`Tuesday: ${timesheet.days[1].totalHrs} Hrs`, 70, 43)
        doc.text(`Jobsite: ${timesheet.days[1].jobsite}`, 115, 43)
        doc.text(`Other Jobsite: ${timesheet.days[1].additional} `, 190, 43)
        doc.text(`Start Time: ${timesheet.days[1].startTime}`, 10, 48)
        doc.text(`Finish Time: ${finishTimes[1] || ''}`, 70, 48)
        doc.text(`Foreman: ${timesheet.days[1].foreman}`, 130, 48)
        const tuesdayText = `Description: ${timesheet.days[1].description}`
        const tuesdayLines = doc.splitTextToSize(tuesdayText, 250)
        tuesdayLines.forEach((line, index) => {
            doc.text(line, 10, 58 + index * 4)
        })

        doc.text(`Date: ${threeDate}`, 10, 82)
        doc.text(`Wednesday: ${timesheet.days[2].totalHrs} Hrs`, 70, 82)
        doc.text(`Jobsite: ${timesheet.days[2].jobsite}`, 115, 82)
        doc.text(`Other Jobsite: ${timesheet.days[2].additional} `, 190, 82)
        doc.text(`Start Time: ${timesheet.days[2].startTime}`, 10, 87)
        doc.text(`Finish Time: ${finishTimes[2] || ''}`, 70, 87)
        doc.text(`Foreman: ${timesheet.days[2].foreman}`, 130, 87)
        const wednesdayText = `Description: ${timesheet.days[2].description}`
        const wednesdayLines = doc.splitTextToSize(wednesdayText, 250)
        wednesdayLines.forEach((line, index) => {
            doc.text(line, 10, 97 + index * 4)
        })

        doc.text(`Date: ${fourDate}`, 10, 116)
        doc.text(`Thursday: ${timesheet.days[3].totalHrs} Hrs`, 70, 116)
        doc.text(`Jobsite: ${timesheet.days[3].jobsite}`, 115, 116)
        doc.text(`Other Jobsite: ${timesheet.days[3].additional} `, 190, 116)
        doc.text(`Start Time: ${timesheet.days[3].startTime}`, 10, 121)
        doc.text(`Finish Time: ${finishTimes[3] || ''}`, 70, 121)
        doc.text(`Foreman: ${timesheet.days[3].foreman}`, 130, 121)
        const thursdayText = `Description: ${timesheet.days[3].description}`
        const thursdayLines = doc.splitTextToSize(thursdayText, 250)
        thursdayLines.forEach((line, index) => {
            doc.text(line, 10, 131 + index * 4)
        })

        doc.text(`Date: ${fiveDate}`, 10, 150)
        doc.text(`Friday: ${timesheet.days[4].totalHrs} Hrs`, 70, 150)
        doc.text(`Jobsite: ${timesheet.days[4].jobsite}`, 115, 150)
        doc.text(`Other Jobsite: ${timesheet.days[4].additional} `, 190, 150)
        doc.text(`Start Time: ${timesheet.days[4].startTime}`, 10, 155)
        doc.text(`Finish Time: ${finishTimes[4] || ''}`, 70, 155)
        doc.text(`Foreman: ${timesheet.days[4].foreman}`, 130, 155)
        const fridayText = `Description: ${timesheet.days[4].description}`
        const fridayLines = doc.splitTextToSize(fridayText, 250)
        fridayLines.forEach((line, index) => {
            doc.text(line, 10, 165 + index * 4)
        })

        doc.text(`Date: ${sixDate}`, 10, 180)
        doc.text(`Saturday: ${timesheet.days[5].totalHrs} Hrs`, 70, 180)
        doc.text(`Jobsite: ${timesheet.days[5].jobsite}`, 115, 180)
        doc.text(`Other Jobsite: ${timesheet.days[5].additional} `, 190, 180)
        doc.text(`Start Time: ${timesheet.days[5].startTime}`, 10, 185)
        doc.text(`Finish Time: ${finishTimes[5] || ''}`, 70, 185)
        doc.text(`Foreman: ${timesheet.days[5].foreman}`, 130, 185)
        const satText = `Description: ${timesheet.days[5].description}`
        const satLines = doc.splitTextToSize(satText, 250)
        satLines.forEach((line, index) => {
            doc.text(line, 10, 195 + index * 4)
        })

        doc.save(`${timesheet.author}${timesheet.days[0].date}.pdf`)
    }

    return (
        <div id="menu" className="p-2 rounded mt-5" key={`${timesheet._id}${timesheet.author}`}>
            <div className="flex items-center justify-between border-b-[1px] pb-1">
                <h4>{timesheet.author}</h4>
                {timesheet.dateCreated ? <p>Created: {timesheet.dateCreated}</p> : <> </>}
                <div className="w-[150px] flex flex-row justify-between">
                {auth.isModerator || auth.isAdmin ? (
                    <>
                        <button
                            className="text-white border p-1 rounded bg-slate-600"
                            onClick={e => {
                            e.preventDefault()
                            axios.post("/api/email/timesheet", { timesheet })
                            }}>
                            {mailIcon}
                        </button>
                        <button
                            className="text-white border p-1 rounded bg-slate-600"
                            onClick={generatePDF}>
                            {printIcon}
                        </button>
                    </>
                ) : (
                    <></>
                )}
                {auth.isAdmin ? (
                    <button
                        className="bg-red-600 hover:bg-red-500 p-1 rounded"
                        onClick={handleDelete}>
                        delete
                    </button>
                ) : (
                    <></>
                )}
                </div>
            </div>
            <Carousel slide={false}>
                {timesheet &&
                timesheet.days.map((day, index) => {
                    const oneArr = day.date.split("-")
                    const oneDate = `${oneArr[1]}-${oneArr[2]}-${oneArr[0]}`
                    return (
                        <Carousel.Item
                            className="pl-5 pr-5 lg:pl-[115px] lg:pr-[115px]"
                            key={`${day.date}${day.description}${index}`}>
                            <div className="p-2 rounded m-1 flex flex-col items-start">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:flex lg:flex-row lg:items-center lg:justify-evenly">
                                <p className="timesheet-item">Date: {oneDate}</p>
                                <p className="timesheet-item">Start Time: {day.startTime}</p>
                                <p className="timesheet-item">Finish Time: {day.finishTime}</p>
                                <p className="timesheet-item">Total Hrs: {day.totalHrs}</p>
                                <p className="timesheet-item">Jobsite: {day.jobsite}</p>
                                <p className="timesheet-item">Foreman: {day.foreman}</p>
                            </div>
                            <p className="timesheet-item w-full lg:w-[100px]">Description:</p>
                            <p className="break-words">{day.description}</p>
                            </div>
                        </Carousel.Item>
                    )
                })}
            </Carousel>
        </div>
   )
}

export default TimesheetCard
