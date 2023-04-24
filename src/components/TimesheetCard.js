import React from 'react'

const TimesheetCard = ( {timesheet} ) => {
  return (
    <div id='menu' className='p-2 rounded mt-5'>
        <h4 className='border-b-[1px]'>{timesheet.author}</h4>
        { timesheet && timesheet.days.map(day => {
            return(
                <div className='p-2 border-[1px] rounded m-1 flex flex-col'>
                    <div className='flex flex-col lg:flex-row items-center justify-evenly'>
                        <p className='timesheet-item'>Date: {day.date}</p>
                        <p className='timesheet-item'>Start Time: {day.startTime}</p>
                        <p className='timesheet-item'>Finish Time: {day.finishTime}</p>
                        <p className='timesheet-item'>Jobsite: {day.jobsite}</p>
                        <p className='timesheet-item'>Foreman: {day.foreman}</p>
                        <p className='timesheet-item'>Total Hrs: {day.totalHrs}</p>
                    </div>
                    <p className='timesheet-item w-[100px]'>Description:</p>
                    <p className='break-words'>{day.description}</p>
                </div>
            )
        }) }

    </div>
  )
}

export default TimesheetCard