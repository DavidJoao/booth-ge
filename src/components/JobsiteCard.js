import React from 'react'

const JobsiteCard = ( { jobsite } ) => {
  return (
    <div className='border-[1px] border-black w-full md:w-[500px] h-[650px] basic-container m-2'>
        <h1 className='border-[1px] border-white p-2 rounded-lg font-extrabold text-3xl'>{jobsite.name}</h1>
        <div className='border-[1px] border-white p-2 mt-2 rounded-lg h-[70%]'>
            <p>Address: {jobsite.address}</p>
            <p>Superintendent: {jobsite.superintendent}</p>
            <p>Employees:</p>
            { jobsite && jobsite.employees.length != 0 ? jobsite.employees.map(employee => {
                return(
                    <p>{employee}</p>
                )
            })
            :
            <p>No employees yet</p>
            }
        </div>
    </div>
  )
}

export default JobsiteCard