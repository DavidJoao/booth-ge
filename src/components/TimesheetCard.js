import axios from '@/custom/axios';
import React from 'react'
import { Carousel } from 'react-bootstrap';

const TimesheetCard = ( {timesheet, loadAll} ) => {


    const handleDelete = (e) => {
        e.preventDefault();
        axios.delete(`/api/timesheet/delete/${timesheet._id}`)
            .then(() => loadAll())
    }

  return (
    <div id='menu' className='p-2 rounded mt-5'>
        <div className='flex items-center justify-between border-b-[1px] pb-1'>
            <h4>{timesheet.author}</h4>
            <button className='bg-red-600 hover:bg-red-500 p-1 rounded' onClick={handleDelete}>delete</button>
        </div>
        <Carousel slide={false}>

        { timesheet && timesheet.days.map(day => {
            return(
                <Carousel.Item className='pl-5 pr-5 lg:pl-[115px] lg:pr-[115px]' key={day.date}>
                    <div className='p-2 rounded m-1 flex flex-col items-start'>
                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 lg:flex lg:flex-row lg:items-center lg:justify-evenly'>
                            <p className='timesheet-item'>Date: {day.date}</p>
                            <p className='timesheet-item'>Start Time: {day.startTime}</p>
                            <p className='timesheet-item'>Finish Time: {day.finishTime}</p>
                            <p className='timesheet-item'>Total Hrs: {day.totalHrs}</p>
                            <p className='timesheet-item'>Jobsite: {day.jobsite}</p>
                            <p className='timesheet-item'>Foreman: {day.foreman}</p>
                        </div>
                        <p className='timesheet-item w-full lg:w-[100px]'>Description:</p>
                        <p className='break-words'>{day.description}</p>
                    </div>
                </Carousel.Item>
            )
        }) }
        </Carousel>

    </div>
  )
}

export default TimesheetCard