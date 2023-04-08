import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import axios from '@/custom/axios'
import AuthContext from '@/custom/AuthProvider'

const JobsiteCard = ( { jobsite } ) => {

  const router = useRouter()
  const { loadAll } = useContext(AuthContext)

  return (
    <div className='border-[1px] border-black w-full md:w-[500px] h-[650px] basic-container m-2'>
        <h1 className='border-[1px] border-white p-2 rounded-lg font-extrabold text-3xl'>{jobsite.name}</h1>
        <div className='border-[1px] border-white p-2 mt-2 rounded-lg h-[70%]'>
            <p>Address: {jobsite.address}</p>
            <p>Superintendent: {jobsite.superintendent}</p>
            <p>Employees:</p>
            { jobsite && jobsite.employees.length != 0 ? jobsite.employees.map(employee => {
                return(
                  <div className='flex flex-row items-center justify-between'>
                    <p>{employee}</p>
                    <button className='bg-red-700 rounded w-[70px]' onClick={() => {
                      axios.patch(`/api/jobsite/remove/${employee}/${jobsite._id}`)
                        .then(res => loadAll())
                    }}>remove</button>
                  </div>
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