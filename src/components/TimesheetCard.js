import axios from '@/custom/axios';
import React from 'react'

const TimesheetCard = ( {timesheet, loadAll} ) => {


    const handleDelete = (e) => {
        e.preventDefault();
        axios.delete(`/api/timesheet/delete/${timesheet._id}`)
            .then(() => loadAll())
    }

  return (
    <div id='menu' className='p-2 rounded mt-5'>
        <div className='flex items-center justify-between border-b-[1px]'>
            <h4>{timesheet.author}</h4>
            <button className='bg-red-600 hover:bg-red-500 p-1 rounded' onClick={handleDelete}>delete</button>
        </div>
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