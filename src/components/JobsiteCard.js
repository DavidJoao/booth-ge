import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '@/custom/axios'
import AuthContext from '@/custom/AuthProvider'
import { Modal } from 'react-bootstrap'

const JobsiteCard = ( { jobsite, auth } ) => {

  const trashLogo = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>

  const router = useRouter()
  const { loadAll } = useContext(AuthContext)
  const [showDelete, setShowDelete] = useState(false)
  
  const handleDelete = () => {
    axios.delete(`/api/jobsite/delete/${jobsite._id}`)
    .then(res => loadAll())
  }

  console.log(jobsite)

  return (
    <div className='w-full lg:w-[500px] h-[280px] lg:h-[500px] m-2 basic-container'>
          <h1 className='border-t-[1px] border-l-[1px] border-r-[1px] border-white p-2 rounded-tr-lg rounded-tl-lg font-extrabold text-3xl flex items-center justify-between'>
            {jobsite.name}
            { auth.isAdmin ? 
            <button className='bg-red-700 p-1 border rounded' onClick={() => setShowDelete(true)}>{trashLogo}</button>
            :
            ''
             }
          </h1>
          <Modal show={showDelete} onHide={() => setShowDelete(false)}>
            <Modal.Header className='text-2xl font-bold bg-[#242526]'>Are you sure you want to delete {jobsite.name}?</Modal.Header>
            <Modal.Body className='flex items-center justify-between bg-[#242526]'>
              <button className='buttons' onClick={() => setShowDelete(false)}>Cancel</button>
              <button className='red-buttons' onClick={() => {
                handleDelete()
                setShowDelete(false)
              }}>Delete</button>
            </Modal.Body>
          </Modal>
        <div className='border-[1px] p-2 rounded-lg rounded-tl-none overflow-auto lg:h-auto'>
            <p>Address: {jobsite.address}</p>
            <p className='  pt-2'>Start Time: {jobsite.startTime} A.M.</p>
            <p className='border-t-[1px] border-white pt-2'>Superintendent: {jobsite.superintendent}</p>
            <p className='border-t-[1px] border-white pt-2'>Employees:</p>
            { jobsite && jobsite.employees.length != 0 ? jobsite.employees.map(employee => {
                return(
                  <div className='flex flex-row items-center justify-between'>
                    <p>{employee.name}</p>
                    { auth.isAdmin ? 
                      <button className='bg-red-700 rounded w-[70px]' onClick={() => {
                        axios.patch(`/api/user/remove/${employee._id}/${jobsite._id}`)
                          .then(res => loadAll())
                      }}>remove</button>
                    :
                      <></>
                     }
                  </div>
                )}) : <p>No employees</p>
            }
            <p className='border-t-[1px] border-white pt-2'>Equipment:</p>
            { jobsite && jobsite.equipment.length != 0 ? jobsite.equipment.map(equipment => {
              return(
                <div className='border flex flex-col justify-center rounded p-2 mb-2'>
                  <div className='flex flex-row items-start justify-between'>
                    <p>{equipment.number} {equipment.name}</p>
                    { auth.isAdmin ? 
                    <div>
                      {/* <button className='bg-slate-500 rounded w-[70px] mr-2'>edit</button> */}
                      <button className='bg-red-700 rounded w-[70px]' onClick={() => {
                        axios.patch(`/api/equipment/remove/${equipment._id}/${jobsite._id}`)
                        .then(res => loadAll())
                      }}>remove</button>
                    </div>
                    :
                    <></>
                  }
                  </div>
                </div>
              )}) : <p>No equipment</p>}

        </div>
    </div>
  )
}

export default JobsiteCard