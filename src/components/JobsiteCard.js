import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import axios from '@/custom/axios'
import AuthContext from '@/custom/AuthProvider'

const JobsiteCard = ( { jobsite, auth } ) => {

  const trashLogo = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>

  const router = useRouter()
  const { loadAll } = useContext(AuthContext)
  
  const handleDelete = () => {
    axios.delete(`/api/jobsite/delete/${jobsite._id}`)
    .then(res => loadAll())
  }

  return (
    <div className='border-[1px] border-black w-full md:w-[500px] h-[650px] basic-container m-2'>
          <h1 className='border-[1px] border-white p-2 rounded-lg font-extrabold text-3xl flex items-center justify-between'>
            {jobsite.name}
            { auth.isAdmin ? 
            <button className='bg-red-700 p-1 border rounded' onClick={handleDelete}>{trashLogo}</button>
            :
            ''
             }
          </h1>
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